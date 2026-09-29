# ============================================================
#  DogFood Theme Preview Launcher
#  Starts all five color variants simultaneously on ports:
#    5173 → Emerald Forge
#    5174 → Copper Flame
#    5175 → Crimson Core
#    5176 → Gold Olive
#    5177 → Terracotta Sage
#
#  All five instances share the SAME frontend codebase.
#  The theme is determined automatically from window.location.port.
#
#  Usage:
#    cd frontend
#    powershell -ExecutionPolicy Bypass -File scripts/start-theme-previews.ps1
# ============================================================

$FrontendRoot = Split-Path $PSScriptRoot -Parent

$themes = @(
    @{ Name = "Emerald Forge";   Port = 5173; Color = "Green" },
    @{ Name = "Copper Flame";    Port = 5174; Color = "DarkYellow" },
    @{ Name = "Crimson Core";    Port = 5175; Color = "Red" },
    @{ Name = "Gold Olive";      Port = 5176; Color = "Yellow" },
    @{ Name = "Terracotta Sage"; Port = 5177; Color = "DarkCyan" }
)

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor White
Write-Host "  ║          DogFood Theme Preview Launcher          ║" -ForegroundColor White
Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor White
Write-Host ""

# Launch each theme in a separate PowerShell window
foreach ($theme in $themes) {
    $port = $theme.Port
    $name = $theme.Name
    $color = $theme.Color

    Write-Host "  Starting [$name] on http://localhost:$port ..." -ForegroundColor $color

    $cmd = "cd '$FrontendRoot'; `$host.UI.RawUI.WindowTitle = 'DogFood — $name [:$port]'; npm run dev -- --port $port"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd
    
    Start-Sleep -Milliseconds 400
}

Write-Host ""
Write-Host "  ─────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "  All 5 theme instances are starting up." -ForegroundColor White
Write-Host ""
Write-Host "  Open these URLs side-by-side in your browser:" -ForegroundColor Gray
Write-Host ""

foreach ($theme in $themes) {
    Write-Host ("  http://localhost:{0}  →  {1}" -f $theme.Port, $theme.Name) -ForegroundColor $theme.Color
}

Write-Host ""
Write-Host "  NOTE: All instances share the SAME backend." -ForegroundColor DarkGray
Write-Host "        Only the color identity differs per port." -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Press any key to open all in your default browser..." -ForegroundColor White
$null = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

foreach ($theme in $themes) {
    Start-Process "http://localhost:$($theme.Port)"
    Start-Sleep -Milliseconds 300
}
