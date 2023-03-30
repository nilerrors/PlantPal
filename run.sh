if [$# -eq 0] || [$0 -ne "client" && $0 -ne "server"] {
    echo "run.ps1 [env]"
    echo "  env:"
    echo "        server"
    echo "        client"

    exit
}

cd $0

if [$0 -eq "client"] {
    yarn start
} else {
    source venv/bin/activate
    uvicorn src:app --reload --host 0.0.0.0 --ssl-keyfile .\key.pem --ssl-certfile .\cert.pem
}
