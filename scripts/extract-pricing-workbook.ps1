param([Parameter(Mandatory=$true)][string]$WorkbookPath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $WorkbookPath))
function ReadEntry($name) {
  $entry = $zip.GetEntry($name)
  if (!$entry) { return $null }
  $reader = [IO.StreamReader]::new($entry.Open())
  try { $reader.ReadToEnd() } finally { $reader.Dispose() }
}
try {
  [xml]$shared = ReadEntry 'xl/sharedStrings.xml'
  $strings = @($shared.sst.si | ForEach-Object { ($_.SelectNodes('.//*[local-name()="t"]') | ForEach-Object { $_.InnerText }) -join '' })
  [xml]$workbook = ReadEntry 'xl/workbook.xml'
  [xml]$rels = ReadEntry 'xl/_rels/workbook.xml.rels'
  $sheets = @($workbook.workbook.sheets.sheet | ForEach-Object {
    $sheet = $_
    $id = $sheet.GetAttribute('id','http://schemas.openxmlformats.org/officeDocument/2006/relationships')
    $target = ($rels.Relationships.Relationship | Where-Object { $_.Id -eq $id }).Target
    [xml]$xml = ReadEntry ('xl/' + $target)
    $cells = @($xml.worksheet.sheetData.row.c | ForEach-Object {
      $v = [string]$_.v
      if ($_.t -eq 's') { $v = $strings[[int]$v] }
      if ($_.t -eq 'inlineStr') { $v = $_.is.InnerText }
      [pscustomobject]@{cell=$_.r; value=$v; formula=[string]$_.f; style=[string]$_.s}
    })
    [pscustomobject]@{name=$sheet.name; state=[string]$sheet.state; cells=$cells; merges=@($xml.worksheet.mergeCells.mergeCell | ForEach-Object { $_.ref })}
  })
  $result = [pscustomobject]@{
    source=[IO.Path]::GetFileName($WorkbookPath)
    sha256=(Get-FileHash -LiteralPath $WorkbookPath -Algorithm SHA256).Hash
    sheets=$sheets
    extraEntries=@($zip.Entries | Where-Object { $_.FullName -match 'comment|table|externalLink' } | ForEach-Object { $_.FullName })
  }
  $dir = Join-Path $PSScriptRoot '../docs/pricing-2027'
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $result | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 (Join-Path $dir 'workbook-cells.json')
  Write-Output "Exported $($sheets.Count) sheets; source SHA256 $($result.sha256)"
} finally { $zip.Dispose() }
