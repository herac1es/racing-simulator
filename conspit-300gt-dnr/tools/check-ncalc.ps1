param([Parameter(Mandatory=$true)][string]$SimHubRoot)
$ErrorActionPreference = 'Stop'
[void][System.Reflection.Assembly]::LoadFrom((Join-Path $simhubRoot 'NCalc.dll'))
$profilePath = Join-Path $PSScriptRoot '../profiles/CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile'
$profile = Get-Content -LiteralPath $profilePath -Raw -Encoding UTF8 | ConvertFrom-Json
$script:ncalcCount = 0
$script:ncalcErrors = [System.Collections.Generic.List[object]]::new()
function Inspect-FormulaNode($Node, [string]$NodePath) {
    if ($null -eq $Node -or $Node -is [string] -or $Node -is [ValueType]) { return }
    if ($Node -is [Array]) {
        for ($index = 0; $index -lt $Node.Count; $index++) { Inspect-FormulaNode $Node[$index] ($NodePath + '/' + $index) }
        return
    }
    foreach ($property in $Node.PSObject.Properties) {
        $value = $property.Value
        if ($null -ne $value -and $null -ne $value.PSObject.Properties['Expression']) {
            $expressionText = [string]$value.Expression
            if ($value.Interpreter -ne 1 -and -not [string]::IsNullOrWhiteSpace($expressionText)) {
                $script:ncalcCount++
                $expression = New-Object NCalc.Expression -ArgumentList $expressionText
                if ($expression.HasErrors()) {
                    $script:ncalcErrors.Add([PSCustomObject]@{path=($NodePath + '/' + $property.Name);expression=$expressionText;error=$expression.Error})
                }
            }
        } else { Inspect-FormulaNode $value ($NodePath + '/' + $property.Name) }
    }
}
Inspect-FormulaNode $profile ''
$result = [PSCustomObject]@{scope='Parsed NCalc formulas with the installed SimHub NCalc.dll. Property availability and custom function execution are not evaluated.';count=$script:ncalcCount;failed=$script:ncalcErrors.Count;errors=$script:ncalcErrors}
$result | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $PSScriptRoot '../.validation/ncalc-validation.json') -Encoding UTF8
$result | Select-Object scope,count,failed | ConvertTo-Json
if ($script:ncalcErrors.Count -gt 0) { exit 1 }
