param([Parameter(Mandatory=$true)][string]$SimHubRoot)
$ErrorActionPreference = 'Stop'
$nativeScratch = Join-Path $PSScriptRoot '../.validation/native-scratch'
[void][IO.Directory]::CreateDirectory((Join-Path $nativeScratch 'JavascriptExtensions'))
[Environment]::CurrentDirectory = $nativeScratch
$outputDir = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../profiles'))
Add-Type -AssemblyName PresentationFramework
[void][Reflection.Assembly]::LoadFrom((Join-Path $simhubRoot 'Newtonsoft.Json.dll'))
$assembly = [Reflection.Assembly]::LoadFrom((Join-Path $simhubRoot 'SimHub.Plugins.dll'))
$profileType = $assembly.GetType('SimHub.Plugins.DataPlugins.RGBDriver.Settings.Profile', $true)
$containerBase = $assembly.GetType('SimHub.Plugins.DataPlugins.RGBDriver.LedsContainers.Base.LedsContainerBase',$true)
$converterType = $assembly.GetType('SimHub.Plugins.DataPlugins.RGBDriver.Utilities.LedContainerJsonConverter',$true)
$addType = $converterType.GetMethod('AddType',[Reflection.BindingFlags]'NonPublic,Static')
try { $builtInTypes = $assembly.GetTypes() } catch [Reflection.ReflectionTypeLoadException] { $builtInTypes = $_.Exception.Types }
foreach ($builtInType in $builtInTypes) {
    if ($null -ne $builtInType -and -not $builtInType.IsAbstract -and $builtInType.IsSubclassOf($containerBase)) { [void]$addType.Invoke($null,@($builtInType)) }
}
$json = [IO.File]::ReadAllText((Join-Path $outputDir 'CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile'))
try {
    $profile = [Newtonsoft.Json.JsonConvert]::DeserializeObject($json, $profileType)
    $roundtrip = [Newtonsoft.Json.JsonConvert]::SerializeObject($profile)
    [IO.File]::WriteAllText((Join-Path $nativeScratch 'roundtrip.json'),$roundtrip)
    $roundtripObject = $roundtrip | ConvertFrom-Json
    if ($roundtrip.Contains('"OriginalJson"')) { throw 'UnknownContainer appeared in native roundtrip' }
    $script:containerCount = 0
    function Count-Nodes($Node) {
        if ($null -eq $Node) { return }
        if ($null -ne $Node.PSObject.Properties['ContainerType']) { $script:containerCount++ }
        if ($null -ne $Node.PSObject.Properties['LedContainers']) { foreach ($child in $Node.LedContainers) { Count-Nodes $child } }
    }
    Count-Nodes $roundtripObject
    $report = [PSCustomObject]@{success=$true;scope='Deserialized in an isolated Windows PowerShell process with installed SimHub RGBDriver.Settings.Profile and JsonConvert. No profile import, device connection, rendering or application settings change.';name=$profile.Name;topLevelGroups=$profile.LedContainers.Count;containers=$script:containerCount;embeddedJsCharacters=$profile.EmbeddedJavascript.Length}
} catch {
    $report = [PSCustomObject]@{success=$false;error=$_.Exception.ToString()}
}
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot '../.validation/native-validation.json') -Encoding UTF8
$report | ConvertTo-Json -Depth 5
if (-not $report.success) { exit 1 }
