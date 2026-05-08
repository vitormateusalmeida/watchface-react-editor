import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const reportsDir = path.join(root, "quality", "reports")
const baselinePath = path.join(root, "quality", "baseline.json")
const currentPath = path.join(reportsDir, "quality-current.json")
const summaryPath = path.join(reportsDir, "quality-summary.md")
const updateBaseline = process.argv.includes("--update-baseline")

const oversizedLineLimit = 500
const sourceRoots = ["src", "tests"]
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"])
const ignoredPathParts = [
  `${path.sep}components${path.sep}ui${path.sep}`,
  `${path.sep}vendor${path.sep}watchface-js${path.sep}dist${path.sep}`,
]

mkdirSync(reportsDir, { recursive: true })

const current = {
  coverage: readCoverage(),
  duplication: readDuplication(),
  violations: {
    qualityRuleViolations: readEslintViolations(),
    oversizedFiles: countOversizedFiles(),
  },
}

if (updateBaseline) {
  writeJson(baselinePath, current)
}

const baseline = readJson(baselinePath)
const comparisons = compareQuality(baseline, current)

writeJson(currentPath, current)
writeFileSync(summaryPath, renderMarkdown(baseline, current, comparisons))

const failures = comparisons.filter((item) => item.status === "fail")
if (failures.length > 0) {
  console.error(`Quality baseline failed with ${failures.length} violation(s).`)
  for (const failure of failures) {
    console.error(
      `- ${failure.group}.${failure.metric}: baseline ${formatValue(failure.baseline, failure.unit)}, current ${formatValue(failure.current, failure.unit)}`,
    )
  }
  process.exit(1)
}

console.log(`Quality baseline passed. Summary: ${path.relative(root, summaryPath)}`)

function readCoverage() {
  const coveragePath = path.join(reportsDir, "coverage", "coverage-summary.json")
  const coverage = readJson(coveragePath)
  const total = coverage.total

  return {
    lines: roundMetric(total.lines.pct),
    statements: roundMetric(total.statements.pct),
    functions: roundMetric(total.functions.pct),
    branches: roundMetric(total.branches.pct),
  }
}

function readDuplication() {
  const candidates = [
    path.join(reportsDir, "jscpd", "jscpd-report.json"),
    path.join(reportsDir, "jscpd", "jscpd.json"),
    path.join(reportsDir, "jscpd", "report.json"),
  ]
  const reportPath = candidates.find((candidate) => existsSync(candidate))

  if (!reportPath) {
    return {
      percentage: 0,
      fragments: 0,
    }
  }

  const report = readJson(reportPath)
  const statistics = report.statistics ?? report
  const total = statistics.total ?? statistics

  return {
    percentage: roundMetric(readFirstNumber(total.percentage, total.percentageClone, total.duplicatedPercentage)),
    fragments: readFirstNumber(total.clones, total.duplicates, total.fragments, total.duplicatedFragments),
  }
}

function readEslintViolations() {
  const eslintPath = path.join(reportsDir, "eslint.json")
  if (!existsSync(eslintPath)) {
    return 0
  }

  const files = readJson(eslintPath)
  return files.reduce((total, file) => total + file.errorCount + file.warningCount, 0)
}

function countOversizedFiles() {
  const files = sourceRoots.flatMap((sourceRoot) => walk(path.join(root, sourceRoot)))

  return files.filter((file) => {
    if (!sourceExtensions.has(path.extname(file))) {
      return false
    }
    if (ignoredPathParts.some((part) => file.includes(part))) {
      return false
    }

    const lineCount = readFileSync(file, "utf8").split(/\r?\n/).length
    return lineCount > oversizedLineLimit
  }).length
}

function walk(directory) {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry)
    const stats = statSync(fullPath)
    return stats.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

function compareQuality(baseline, current) {
  return [
    compareMetric("coverage", "lines", "min", "%", baseline.coverage.lines, current.coverage.lines),
    compareMetric("coverage", "statements", "min", "%", baseline.coverage.statements, current.coverage.statements),
    compareMetric("coverage", "functions", "min", "%", baseline.coverage.functions, current.coverage.functions),
    compareMetric("coverage", "branches", "min", "%", baseline.coverage.branches, current.coverage.branches),
    compareMetric("duplication", "percentage", "max", "%", baseline.duplication.percentage, current.duplication.percentage),
    compareMetric("duplication", "fragments", "max", "", baseline.duplication.fragments, current.duplication.fragments),
    compareMetric(
      "violations",
      "qualityRuleViolations",
      "max",
      "",
      baseline.violations.qualityRuleViolations,
      current.violations.qualityRuleViolations,
    ),
    compareMetric("violations", "oversizedFiles", "max", "", baseline.violations.oversizedFiles, current.violations.oversizedFiles),
  ]
}

function compareMetric(group, metric, direction, unit, baseline, current) {
  const status = direction === "min" ? current >= baseline : current <= baseline
  return {
    group,
    metric,
    direction,
    unit,
    baseline,
    current,
    delta: roundMetric(current - baseline),
    status: status ? "pass" : "fail",
  }
}

function renderMarkdown(baseline, current, comparisons) {
  return [
    "# Quality Summary",
    "",
    `Status: ${comparisons.every((item) => item.status === "pass") ? "pass" : "fail"}`,
    "",
    "## Coverage",
    "",
    renderTable([
      row("Lines", baseline.coverage.lines, current.coverage.lines, "%", comparisons),
      row("Statements", baseline.coverage.statements, current.coverage.statements, "%", comparisons),
      row("Functions", baseline.coverage.functions, current.coverage.functions, "%", comparisons),
      row("Branches", baseline.coverage.branches, current.coverage.branches, "%", comparisons),
    ]),
    "",
    "## Duplication",
    "",
    renderTable([
      row("Percentage", baseline.duplication.percentage, current.duplication.percentage, "%", comparisons),
      row("Fragments", baseline.duplication.fragments, current.duplication.fragments, "", comparisons),
    ]),
    "",
    "## Violations",
    "",
    renderTable([
      row("Quality rule violations", baseline.violations.qualityRuleViolations, current.violations.qualityRuleViolations, "", comparisons),
      row("Oversized files", baseline.violations.oversizedFiles, current.violations.oversizedFiles, "", comparisons),
    ]),
    "",
  ].join("\n")
}

function row(label, baseline, current, unit, comparisons) {
  const metric = label.replaceAll(" ", "").replace(/^./, (char) => char.toLowerCase())
  const comparison = comparisons.find((item) => item.metric.toLowerCase() === metric.toLowerCase())

  return [label, formatValue(baseline, unit), formatValue(current, unit), formatValue(current - baseline, unit, true), comparison?.status ?? "pass"]
}

function renderTable(rows) {
  return [
    "| Metric | Baseline | Current | Delta | Status |",
    "|---|---:|---:|---:|---|",
    ...rows.map((cells) => `| ${cells.join(" | ")} |`),
  ].join("\n")
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"))
}

function writeJson(filePath, value) {
  writeFileSync(`${filePath}\n`.trim(), `${JSON.stringify(value, null, 2)}\n`)
}

function roundMetric(value) {
  return Math.round(Number(value) * 100) / 100
}

function readFirstNumber(...values) {
  const value = values.find((candidate) => Number.isFinite(Number(candidate)))
  return value === undefined ? 0 : Number(value)
}

function formatValue(value, unit, signed = false) {
  const number = roundMetric(value)
  const prefix = signed && number > 0 ? "+" : ""
  return `${prefix}${number}${unit}`
}
