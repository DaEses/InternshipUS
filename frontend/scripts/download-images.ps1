# Create images directory if it doesn't exist
$imagesDir = Join-Path -Path $PSScriptRoot -ChildPath "..\public\images"
if (-not (Test-Path -Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
}

# Image URLs from Unsplash (free to use)
$images = @{
    "scanner-hero.jpg" = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    "profile-hero.jpg" = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    "job-matcher-hero.jpg" = "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
}

# Function to download image
function Download-Image {
    param (
        [string]$Url,
        [string]$OutputPath
    )
    
    Write-Host "Downloading $($Url) to $($OutputPath)"
    try {
        $client = New-Object System.Net.WebClient
        $client.DownloadFile($Url, $OutputPath)
        Write-Host "Successfully downloaded $($OutputPath)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Error downloading $($Url): $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Download all images
foreach ($image in $images.GetEnumerator()) {
    $outputPath = Join-Path -Path $imagesDir -ChildPath $image.Key
    Download-Image -Url $image.Value -OutputPath $outputPath
}

Write-Host "Image download process completed." -ForegroundColor Cyan
