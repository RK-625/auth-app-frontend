# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# investigation
- When analyzing code for a change, exhaustively check all layers before presenting findings: DTOs, service/helper methods, i18n messages, tests, and frontend UI strings. Trace full call chains end-to-end (controller → service → helper), verify config values are actually used in code, and check for inconsistencies between parallel flows. Confidence: 0.85
- For exhaustive codebase analysis, read files individually rather than relying solely on grep/search — annotations like @Size are grep-friendly, but plain-code checks like `password.length() < 6` are easily missed by keyword search. Confidence: 0.70

