# Russian names dictionaries

Ivan Begtin / Infoculture (2019), *Database of Russian names, surnames and midnames for gender identification*, version 1.0.
Source: https://zenodo.org/records/2747011 — DOI: https://doi.org/10.5281/zenodo.2747011

The record metadata declares CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); its description says CC BY-SA without a version. Both original statements are retained. These derived dictionaries are offered under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/) to preserve attribution and ShareAlike.

Changes: Unicode/case normalization, conservative format filtering, exclusion of singleton rows, deduplication including е/ё, aggregation of source counts, descending-frequency selection of 3000 surnames, 1000 names and 1000 patronymics. No invented entries. This cannot guarantee absence of semantic mistakes in source data. Gender values and available base names are retained. Patronymic baseNames refer to a parent, never to the applicant. Autocomplete compatibility uses known unambiguous gender; manual input remains unrestricted.

Rebuild: `python3 scripts/prepare-names.py`. Original archive and metadata are kept under research/names-source, outside public and the production bundle. Only the three bounded dictionaries are loaded on demand. See provenance.json for checksum and counts.
