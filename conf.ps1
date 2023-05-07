function ArgsContains([string]$s) {
  return $null -ne ($Args | ? { $s -match $_ })
}

function GetIP {
  return $(ipconfig | where {$_ -match 'IPv4.+\s(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' } | out-null; $Matches[1])
}

function GenerateRandomString($count = 10) {
  -join ((48..57) + (97..122) | Get-Random -Count $count | % {[char]$_})
}

$EMAIL = "enayat.sabawoon@outlook.com"
$DEV = $true
$MIGRATION_NAME = "init"
$RANDOM_STRING = GenerateRandomString(30)


if (ArgsContains("-p") -or ArgsContains("--prod")) {
  $DEV = $false
}
if (ArgsContains("-e") -or ArgsContains("--email")) {
  $index = -1
  if (ArgsContains("-e")) {
    $index = [array]::indexof($Args, "-e") 
  } else {
    $index = [array]::indexof($Args, "--email") 
  }
  if ($Args.length -lt $index + 1) {
    Write-Host "No email given"
    exit
  }
  $EMAIL = $Args[$index + 1]
}
if (ArgsContains("-mn") -or ArgsContains("--migration-name")) {
  $index = -1
  if (ArgsContains("-mn")) {
    $index = [array]::indexof($Args, "-mn") 
  } else {
    $index = [array]::indexof($Args, "--migration-name") 
  }
  if ($Args.length -lt $index + 1) {
    Write-Host "No migration name given"
    exit
  }
  $MIGRATION_NAME = $Args[$index + 1]
}

function PrismaCommand {
  cd .\server
  prisma generate
  Write-Host "prisma generated"
  if ($DEV) {
    prisma migrate dev --name=$MIGRATION_NAME
  } else {
    prisma migrate prod --name=$MIGRATION_NAME
  }
  cd ..
  Write-Host "prisma migrated"
}

if (ArgsContains("--prisma")) {
  PrismaCommand
  exit
}

Set-Content .\client\.env ('VITE_API_BASE_URL="http://' + $EMAIL + ':8000"')
cd client && yarn --silent
Write-Host ".\run.ps1 client"
cd ..

Set-Content .\server\.env ('
AUTHJWT_SECRET_KEY="' + $RANDOM_STRING + '"

MAIL_USERNAME="' + $EMAIL + '"
MAIL_PASSWORD=""
MAIL_FROM="' + $EMAIL + '"
MAIL_PORT=587
MAIL_SERVER="smtp.office365.com"
MAIL_FROM_NAME="PlantPal"

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/management"')

Write-Host "Change MAIL_PASSWORD in .\server\.env"

Set-Content .\server\prisma\.env 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/management"'

cd server
py -m venv venv
Write-Host "venv created"
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Host "deps installed"

cd ..
PrismaCommand

Write-Host ".\run.ps1 server"
