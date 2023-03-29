if (($Args).Length -eq 0 -or ($Args[0] -ne "client" -and $Args[0] -ne "server")) {
    Write-Host "run.ps1 [env]"
    Write-Host "  env:"
    Write-Host "        server"
    Write-Host "        client"

    Exit-PSSession
}

Set-Location $Args[0]

if ($Args[0] -eq "client") {
    yarn start
} else {
    .\venv\Scripts\Activate.ps1
    uvicorn src:app --reload --host 0.0.0.0
}
