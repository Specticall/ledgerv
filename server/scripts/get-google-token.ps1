Add-Type -AssemblyName System.Web

$clientId = $env:VITE_GOOGLE_CLIENT_ID
$scope = "profile email openid"
$redirectUri = "http://localhost:8000"
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

if (-not $clientId) {
  Write-Error "Enviroment variables are not loaded, did you use `dotenvx -f .env.development -- [SCRIPT]`?"
  exit 1
}

$scopeEncoded = [System.Web.HttpUtility]::UrlEncode($scope)
$redirectUriEncoded = [System.Web.HttpUtility]::UrlEncode($redirectUri)

$url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=code&scope=${scopeEncoded}&access_type=offline&prompt=consent&redirect_uri=${redirectUriEncoded}"


Write-Host "Opening browser for google authentication..."
Start-Process -FilePath $chromePath -ArgumentList $url
