# PowerShell script to convert CRLF to LF
$files = @(
    "react-app/app/api/summary/route.ts",
    "react-app/app/transcript/page.tsx"
)

foreach ($file in $files) {
    Write-Host "Converting line endings for $file"
    $content = Get-Content -Path $file -Raw
    $content = $content -replace "`r`n", "`n"
    Set-Content -Path $file -Value $content -NoNewline
}

Write-Host "Conversion complete."
