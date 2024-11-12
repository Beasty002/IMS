# Variables
$browserUrl = "http://localhost:5173"
$serverScriptPath = ".\"  # Root path to the project
$clientPath = "$serverScriptPath\Client"
$serverPath = "$serverScriptPath\Server"
$stopScriptPath = ".\stop.bat"  # Path to stop.bat

# Start server and client in separate minimized cmd windows
Write-Output "Starting server and client..."
$serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd $serverPath && npm run dev" -WindowStyle Minimized -PassThru
$clientProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd $clientPath && npm run dev" -WindowStyle Minimized -PassThru

# Wait a few seconds to ensure the server is running before opening the browser
Start-Sleep -Seconds 3

# Open the browser tab
$browserProcess = Start-Process -FilePath "chrome.exe" -ArgumentList $browserUrl -PassThru

# Function to check if port 5173 is open
function Test-Localhost5173 {
    try {
        $request = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
        return $true
    }
    catch {
        return $false
    }
}

# Minimize the current PowerShell (CMD) window
$cmdWindow = Get-Process -Id $PID
$cmdWindow.MainWindowHandle | ForEach-Object {
    $hwnd = $_
    Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        public class WindowControl {
            [DllImport("user32.dll")]
            public static extern bool ShowWindow(IntPtr hwnd, int nCmdShow);
            [DllImport("user32.dll")]
            public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
        }
"@
    [WindowControl]::ShowWindow($hwnd, 2)  # Minimize the PowerShell window
}

# Monitor the localhost server and browser activity
Write-Output "Monitoring browser tab and localhost:5173 activity..."
while ($true) {
    # Check if the browser is still running and if localhost:5173 is accessible
    if ($browserProcess.HasExited -or -not (Test-Localhost5173)) {
        # If the browser has exited or localhost:5173 is unavailable, stop server and client
        Write-Output "Browser tab or localhost server closed. Stopping server and client..."

        # Invoke the stop.bat script to terminate the Node.js server and close terminals
        Start-Process -FilePath $stopScriptPath -NoNewWindow -Wait

        break
    }
    Start-Sleep -Seconds 3  # Check every 3 seconds
}

Write-Output "Processes terminated."

# Terminate PowerShell session
Exit
