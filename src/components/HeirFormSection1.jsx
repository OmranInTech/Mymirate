import React, { useState, useEffect, useRef } from "react";
import calculateShares from "../utils/calculateShares";
import { useTranslation } from "react-i18next";

const HeirFormSection1 = () => {
  const { t } = useTranslation();
  // States for estate and heirs
  const [estateAmount, setEstateAmount] = useState("");
  const [wives, setWives] = useState(0);
  const [husbandAlive, setHusbandAlive] = useState(false);
  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);
  const [motherAlive, setMotherAlive] = useState(false);
  const [fatherAlive, setFatherAlive] = useState(false);
  const [brothers, setBrothers] = useState(0);
  const [sisters, setSisters] = useState(0);

  // New heirs for extended form
  const [grandsons, setGrandsons] = useState(0);
  const [granddaughters, setGranddaughters] = useState(0);

  const [grandfatherAlive, setGrandfatherAlive] = useState(false);
  const [maternalGrandmotherAlive, setMaternalGrandmotherAlive] = useState(false);
  const [paternalGrandmotherAlive, setPaternalGrandmotherAlive] = useState(false);

  const [maternalBrothers, setMaternalBrothers] = useState(0);
  const [maternalSisters, setMaternalSisters] = useState(0);
  const [paternalBrothers, setPaternalBrothers] = useState(0);
  const [paternalSisters, setPaternalSisters] = useState(0);

  const [fullNephews, setFullNephews] = useState(0);
  const [paternalNephews, setPaternalNephews] = useState(0);

  const [fullUncles, setFullUncles] = useState(0);
  const [paternalUncles, setPaternalUncles] = useState(0);

  const [fullCousins, setFullCousins] = useState(0);
  const [paternalCousins, setPaternalCousins] = useState(0);

  const [result, setResult] = useState(null);
  const printRef = useRef();

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Collapse toggles for heir sections
  const [isAsabaOpen, setIsAsabaOpen] = useState(false);
  const [isDhawuOpen, setIsDhawuOpen] = useState(false);

  useEffect(() => {
    if (wives > 0 && husbandAlive) setHusbandAlive(false);
  }, [wives]);

  useEffect(() => {
    if (husbandAlive && wives > 0) setWives(0);
  }, [husbandAlive]);

  const handleCalculate = () => {
    // Validate all fields before calculating
    const { ok, errorList } = validateAll();
    if (!ok) {
      alert([t('validationPleaseFixErrors'), '', ...errorList].join('\n'));
      return;
    }
    // Sanitize inputs: ensure non-negative integers for all numeric fields
    const toInt = (n) => Math.max(0, Number.isFinite(Number(n)) ? Math.floor(Number(n)) : 0);
    const clean = {
      wives: toInt(wives),
      sons: toInt(sons),
      daughters: toInt(daughters),
      brothers: toInt(brothers),
      sisters: toInt(sisters),
      grandsons: toInt(grandsons),
      granddaughters: toInt(granddaughters),
      maternalBrothers: toInt(maternalBrothers),
      maternalSisters: toInt(maternalSisters),
      paternalBrothers: toInt(paternalBrothers),
      paternalSisters: toInt(paternalSisters),
      fullNephews: toInt(fullNephews),
      paternalNephews: toInt(paternalNephews),
      fullUncles: toInt(fullUncles),
      paternalUncles: toInt(paternalUncles),
      fullCousins: toInt(fullCousins),
      paternalCousins: toInt(paternalCousins),
    };
    const shares = calculateShares({
      wives: clean.wives,
      husbandAlive,
      sons: clean.sons,
      daughters: clean.daughters,
      motherAlive,
      fatherAlive,
      brothers: clean.brothers,
      sisters: clean.sisters,
      grandsons: clean.grandsons,
      granddaughters: clean.granddaughters,
      grandfatherAlive,
      maternalGrandmotherAlive,
      paternalGrandmotherAlive,
      maternalBrothers: clean.maternalBrothers,
      maternalSisters: clean.maternalSisters,
      paternalBrothers: clean.paternalBrothers,
      paternalSisters: clean.paternalSisters,
      fullNephews: clean.fullNephews,
      paternalNephews: clean.paternalNephews,
      fullUncles: clean.fullUncles,
      paternalUncles: clean.paternalUncles,
      fullCousins: clean.fullCousins,
      paternalCousins: clean.paternalCousins,
    });
    setResult(shares);
  };

  const handleReset = () => {
    setEstateAmount("");
    setWives(0);
    setHusbandAlive(false);
    setSons(0);
    setDaughters(0);
    setMotherAlive(false);
    setFatherAlive(false);
    setBrothers(0);
    setSisters(0);
    setGrandsons(0);
    setGranddaughters(0);
    setGrandfatherAlive(false);
    setMaternalGrandmotherAlive(false);
    setPaternalGrandmotherAlive(false);
    setMaternalBrothers(0);
    setMaternalSisters(0);
    setPaternalBrothers(0);
    setPaternalSisters(0);
    setFullNephews(0);
    setPaternalNephews(0);
    setFullUncles(0);
    setPaternalUncles(0);
    setFullCousins(0);
    setPaternalCousins(0);
    setResult(null);
    setIsAsabaOpen(false);
    setIsDhawuOpen(false);
    setErrors({});
    setTouched({});
  };

  // =============== Validation helpers ===============
  const setFieldError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
  };

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validateNumber = (field, rawValue, { min = 0, max = undefined, requireNumber = false } = {}) => {
    if (requireNumber && (rawValue === "" || rawValue === null || rawValue === undefined)) {
      const msg = `${t('validationRequiredNumber')}. ${t('validationUseZeroIfNone')}`;
      setFieldError(field, msg);
      return { valid: false, msg };
    }
    const value = Number(rawValue);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < min) {
      const msg = `${t('validationEnterNonNegativeInteger')}. ${t('validationUseZeroIfNone')}`;
      setFieldError(field, msg);
      return { valid: false, msg };
    }
    if (typeof max === 'number' && value > max) {
      // specialized messages
      if (field === 'wives') {
        const msg = t('validationMaxWives');
        setFieldError(field, msg);
        return { valid: false, msg };
      } else {
        const msg = `${t('validationEnterNonNegativeInteger')}`;
        setFieldError(field, msg);
        return { valid: false, msg };
      }
    }
    setFieldError(field, undefined);
    return { valid: true };
  };

  const handleNumberChange = (field, rawValue, setter, options = {}) => {
    // Allow empty string during typing
    if (rawValue === "") {
      setter("");
      if (touched[field]) validateNumber(field, rawValue, { requireNumber: true, ...options });
      return;
    }
    const numeric = Math.max(0, Math.floor(Number(rawValue)) || 0);
    setter(numeric);
    if (touched[field]) validateNumber(field, numeric, options);
  };

  const validateAll = () => {
    const fieldToLabelKey = {
      wives: 'numberOfWives',
      sons: 'numberOfSons',
      daughters: 'numberOfDaughters',
      brothers: 'numberOfBrothers',
      sisters: 'numberOfSisters',
      grandsons: 'grandsons',
      granddaughters: 'granddaughters',
      maternalBrothers: 'numberOfMaternalBrothers',
      maternalSisters: 'numberOfMaternalSisters',
      paternalBrothers: 'numberOfPaternalBrothers',
      paternalSisters: 'numberOfPaternalSisters',
      fullNephews: 'numberOfFullNephews',
      paternalNephews: 'numberOfPaternalNephews',
      fullUncles: 'numberOfFullUncles',
      paternalUncles: 'numberOfPaternalUncles',
      fullCousins: 'numberOfFullCousins',
      paternalCousins: 'numberOfPaternalCousins',
    };

    const toCheck = [
      ['wives', wives, { min: 0, max: 4, requireNumber: true }],
      ['sons', sons, { min: 0, requireNumber: true }],
      ['daughters', daughters, { min: 0, requireNumber: true }],
      ['brothers', brothers, { min: 0, requireNumber: true }],
      ['sisters', sisters, { min: 0, requireNumber: true }],
      ['grandsons', grandsons, { min: 0, requireNumber: true }],
      ['granddaughters', granddaughters, { min: 0, requireNumber: true }],
      ['maternalBrothers', maternalBrothers, { min: 0, requireNumber: true }],
      ['maternalSisters', maternalSisters, { min: 0, requireNumber: true }],
      ['paternalBrothers', paternalBrothers, { min: 0, requireNumber: true }],
      ['paternalSisters', paternalSisters, { min: 0, requireNumber: true }],
      ['fullNephews', fullNephews, { min: 0, requireNumber: true }],
      ['paternalNephews', paternalNephews, { min: 0, requireNumber: true }],
      ['fullUncles', fullUncles, { min: 0, requireNumber: true }],
      ['paternalUncles', paternalUncles, { min: 0, requireNumber: true }],
      ['fullCousins', fullCousins, { min: 0, requireNumber: true }],
      ['paternalCousins', paternalCousins, { min: 0, requireNumber: true }],
    ];

    const errorList = [];
    let ok = true;
    toCheck.forEach(([field, value, opts]) => {
      const { valid, msg } = validateNumber(field, value, opts);
      if (!valid) {
        ok = false;
        const labelKey = fieldToLabelKey[field] || field;
        errorList.push(`${t(labelKey)}: ${msg}`);
      }
      markTouched(field);
    });

    return { ok, errorList };
  };

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="text-red-600 text-xs mt-1">{errors[field]}</p>
    ) : null;

  const handlePrint = () => {
    // Gather selected heirs and their shares
    if (!result) return;
    const selectedHeirs = [];
    if (wives > 0) selectedHeirs.push({ label: wives > 1 ? `${t('wives')} (${wives})` : t('wife'), share: result.wives, each: result.wivesEach });
    if (husbandAlive) selectedHeirs.push({ label: t('husband'), share: result.husband });
    if (sons > 0) selectedHeirs.push({ label: sons > 1 ? `${t('sons')} (${sons})` : t('son'), share: result.sons });
    if (daughters > 0) selectedHeirs.push({ label: daughters > 1 ? `${t('daughters')} (${daughters})` : t('daughter'), share: result.daughters });
    if (motherAlive) selectedHeirs.push({ label: t('mother'), share: result.mother });
    if (fatherAlive) selectedHeirs.push({ label: t('father'), share: result.father });
    if (brothers > 0) selectedHeirs.push({ label: brothers > 1 ? `${t('brothers')} (${brothers})` : t('brother'), share: result.brothers });
    if (sisters > 0) selectedHeirs.push({ label: sisters > 1 ? `${t('sisters')} (${sisters})` : t('sister'), share: result.sisters });
    if (grandsons > 0) selectedHeirs.push({ label: grandsons > 1 ? `${t('grandsons')} (${grandsons})` : t('grandson'), share: result.grandsons });
    if (granddaughters > 0) selectedHeirs.push({ label: granddaughters > 1 ? `${t('granddaughters')} (${granddaughters})` : t('granddaughter'), share: result.granddaughters });
    if (grandfatherAlive) selectedHeirs.push({ label: t('grandfather'), share: result.grandfather });
    if (maternalGrandmotherAlive) selectedHeirs.push({ label: t('maternalGrandmother'), share: result.maternalGrandmother });
    if (paternalGrandmotherAlive) selectedHeirs.push({ label: t('paternalGrandmother'), share: result.paternalGrandmother });
    if (maternalBrothers > 0) selectedHeirs.push({ label: maternalBrothers > 1 ? `${t('maternalBrothers')} (${maternalBrothers})` : t('maternalBrother'), share: result.maternalBrothers });
    if (maternalSisters > 0) selectedHeirs.push({ label: maternalSisters > 1 ? `${t('maternalSisters')} (${maternalSisters})` : t('maternalSister'), share: result.maternalSisters });
    if (paternalBrothers > 0) selectedHeirs.push({ label: paternalBrothers > 1 ? `${t('paternalBrothers')} (${paternalBrothers})` : t('paternalBrother'), share: result.paternalBrothers });
    if (paternalSisters > 0) selectedHeirs.push({ label: paternalSisters > 1 ? `${t('paternalSisters')} (${paternalSisters})` : t('paternalSister'), share: result.paternalSisters });
    if (fullNephews > 0) selectedHeirs.push({ label: fullNephews > 1 ? `${t('fullNephews')} (${fullNephews})` : t('fullNephew'), share: result.fullNephews });
    if (paternalNephews > 0) selectedHeirs.push({ label: paternalNephews > 1 ? `${t('paternalNephews')} (${paternalNephews})` : t('paternalNephew'), share: result.paternalNephews });
    if (fullUncles > 0) selectedHeirs.push({ label: fullUncles > 1 ? `${t('fullUncles')} (${fullUncles})` : t('fullUncle'), share: result.fullUncles });
    if (paternalUncles > 0) selectedHeirs.push({ label: paternalUncles > 1 ? `${t('paternalUncles')} (${paternalUncles})` : t('paternalUncle'), share: result.paternalUncles });
    if (fullCousins > 0) selectedHeirs.push({ label: fullCousins > 1 ? `${t('fullCousins')} (${fullCousins})` : t('fullCousin'), share: result.fullCousins });
    if (paternalCousins > 0) selectedHeirs.push({ label: paternalCousins > 1 ? `${t('paternalCousins')} (${paternalCousins})` : t('paternalCousin'), share: result.paternalCousins });
    if (result.baytulmal > 0) selectedHeirs.push({ label: t('baytulmal'), share: result.baytulmal });

    let tableRows = '';
    selectedHeirs.forEach((heir) => {
      if (heir.label === t('wife') || heir.label.startsWith(`${t('wives')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`}`;
        if (result.wivesEach) {
          tableRows += ` (${t('eachWife')}: ${isEstateAmountValid ? `${formatMoney(result.wivesEach * Number(estateAmount))} / ${(result.wivesEach * 100).toFixed(2)}%` : `${(result.wivesEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('son') || heir.label.startsWith(`${t('sons')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`}`;
        if (result.sonsEach) {
          tableRows += ` (${t('eachSon')}: ${isEstateAmountValid ? `${formatMoney(result.sonsEach * Number(estateAmount))} / ${(result.sonsEach * 100).toFixed(2)}%` : `${(result.sonsEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('daughter') || heir.label.startsWith(`${t('daughters')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`}`;
        if (result.daughtersEach) {
          tableRows += ` (${t('eachDaughter')}: ${isEstateAmountValid ? `${formatMoney(result.daughtersEach * Number(estateAmount))} / ${(result.daughtersEach * 100).toFixed(2)}%` : `${(result.daughtersEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('brother') || heir.label.startsWith(`${t('brothers')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`}`;
        if (result.brothersEach) {
          tableRows += ` (${t('eachBrother')}: ${isEstateAmountValid ? `${formatMoney(result.brothersEach * Number(estateAmount))} / ${(result.brothersEach * 100).toFixed(2)}%` : `${(result.brothersEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('fullNephew') || heir.label.startsWith(`${t('fullNephews')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`} `;
        if (result.fullNephewsEach) {
          tableRows += `(${t('eachFullNephew')}: ${isEstateAmountValid ? `${formatMoney(result.fullNephewsEach * Number(estateAmount))} / ${(result.fullNephewsEach * 100).toFixed(2)}%` : `${(result.fullNephewsEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('paternalNephew') || heir.label.startsWith(`${t('paternalNephews')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`} `;
        if (result.paternalNephewsEach) {
          tableRows += `(${t('eachPaternalNephew')}: ${isEstateAmountValid ? `${formatMoney(result.paternalNephewsEach * Number(estateAmount))} / ${(result.paternalNephewsEach * 100).toFixed(2)}%` : `${(result.paternalNephewsEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('fullUncle') || heir.label.startsWith(`${t('fullUncles')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`} `;
        if (result.fullUnclesEach) {
          tableRows += `(${t('eachFullUncle')}: ${isEstateAmountValid ? `${formatMoney(result.fullUnclesEach * Number(estateAmount))} / ${(result.fullUnclesEach * 100).toFixed(2)}%` : `${(result.fullUnclesEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('paternalUncle') || heir.label.startsWith(`${t('paternalUncles')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`} `;
        if (result.paternalUnclesEach) {
          tableRows += `(${t('eachPaternalUncle')}: ${isEstateAmountValid ? `${formatMoney(result.paternalUnclesEach * Number(estateAmount))} / ${(result.paternalUnclesEach * 100).toFixed(2)}%` : `${(result.paternalUnclesEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('fullCousin') || heir.label.startsWith(`${t('fullCousins')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`} `;
        if (result.fullCousinsEach) {
          tableRows += `(${t('eachFullCousin')}: ${isEstateAmountValid ? `${formatMoney(result.fullCousinsEach * Number(estateAmount))} / ${(result.fullCousinsEach * 100).toFixed(2)}%` : `${(result.fullCousinsEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else if (heir.label === t('paternalCousin') || heir.label.startsWith(`${t('paternalCousins')} (`)) {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`} `;
        if (result.paternalCousinsEach) {
          tableRows += `(${t('eachPaternalCousin')}: ${isEstateAmountValid ? `${formatMoney(result.paternalCousinsEach * Number(estateAmount))} / ${(result.paternalCousinsEach * 100).toFixed(2)}%` : `${(result.paternalCousinsEach * 100).toFixed(2)}%`})`;
        }
        tableRows += `</td></tr>`;
      } else {
        tableRows += `<tr><td>${heir.label}</td><td>${isEstateAmountValid ? `${formatMoney(heir.share * Number(estateAmount))} (${(heir.share * 100).toFixed(2)}%)` : `${(heir.share * 100).toFixed(2)}%`}</td></tr>`;
      }
    });
    

    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write('<html><head><title>Inheritance Shares</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;padding:20px;color:#4A4A4A} h1{color:#DC9B83} table{width:100%;border-collapse:collapse;margin-top:20px} th,td{border:1px solid #E8BCA8;padding:8px;text-align:left} th{background:#FAFAFA;color:#DC9B83}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1 style="font-size:2.2em;color:#DC9B83;margin-bottom:0.2em;">MyMirath</h1>');
    printWindow.document.write('<div style="color:#888;font-size:1.1em;margin-bottom:1.5em;">Islamic Inheritance Calculator</div>');
    printWindow.document.write('<h2 style="color:#DC9B83;margin-bottom:1em;">Selected Heirs & Shares</h2>');
    printWindow.document.write('<table><thead><tr><th>Heir</th><th>Share</th></tr></thead><tbody>');
    printWindow.document.write(tableRows);
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const formatMoney = (value) =>
    Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const isEstateAmountValid =
    estateAmount !== "" && !isNaN(estateAmount) && Number(estateAmount) > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center px-3 sm:px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#DC9B83] mb-3 sm:mb-6">{t('calculatorTitle')}</h1>
      {Object.values(errors).some(Boolean) && (
        <div className="w-full max-w-7xl mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {t('validationPleaseFixErrors')}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
{/* LEFT - Guidelines */}

<div className="flex-1 bg-[#FFFFFF] border border-[#E8BCA8] rounded-lg shadow-md p-6 text-[#4A4A4A] min-w-[260px] sm:min-w-[280px] max-w-full lg:max-w-[320px] overflow-y-auto max-h-[calc(90vh)]">
  <h2 className="text-2xl font-semibold text-[#DC9B83] mb-3">{t('proofsOfShares')}</h2>

  <p className="text-[#9A9A9A] text-sm mb-4">
    {t('islamicInheritanceCalculator')}
  </p>

  <h3 className="text-lg font-semibold text-[#DC9B83] mb-2">{t('primaryHeirs')}</h3>

  <ul className="text-sm space-y-2 list-disc list-inside">
    <li>
      <strong>{t('husband')}:</strong><br />
      ➤ <em>½</em> {t('ifNoChildren')}<br />
      ➤ <em>¼</em> {t('ifSheHasChildren')}<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:12]</span>
    </li>

    <li>
      <strong>{t('wife')}:</strong><br />
      ➤ <em>¼</em> {t('ifNoChildren')}<br />
      ➤ <em>⅛</em> {t('ifChildrenExist')} (shared equally)<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:12]</span>
    </li>

    <li>
      <strong>{t('sonsAndDaughters')}:</strong><br />
      ➤ {t('ifOnlyDaughters')}<ul className="list-disc ml-5">
        <li>{t('oneDaughter')} → <em>½</em></li>
        <li>{t('twoOrMore')} → {t('share')} <em>⅔</em></li>
      </ul>
      ➤ {t('ifSonsAndDaughters')} → {t('shareResidue')}, {t('eachSonGetsTwoDaughters')}<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:11]</span>
    </li>

    <li>
      <strong>{t('mother')}:</strong><br />
      ➤ <em>⅙</em> {t('ifChildrenOrTwoPlusSiblings')}<br />
      ➤ <em>⅓</em> {t('ifNoChildrenAndLessThanTwoSiblings')}<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:11]</span>
    </li>

    <li>
      <strong>{t('father')}:</strong><br />
      ➤ <em>⅙</em> {t('ifChildrenExist')}<br />
      ➤ {t('takesResidue')} {t('ifNoChildren')}<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:11]</span>
    </li>

    <li>
      <strong>{t('siblings')}:</strong><br />
      ➤ {t('doNotInherit')} {t('ifChildrenOrFatherExist')}<br />
      ➤ {t('mayInheritAsResiduary')} {t('ifNoChildrenAndNoFather')}<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:12, 4:176]</span>
    </li>
  </ul>

  {/* === New Section: Grandchildren === */}
  <h3 className="text-lg font-semibold text-[#DC9B83] mt-6 mb-2">{t('grandchildren')}</h3>
  <ul className="text-sm space-y-2 list-disc list-inside">
    <li>
      <strong>{t('grandsons')}:</strong><br />
      ➤ {t('inheritOnlyIfTheirFather')} (the deceased's son) {t('isDeceased')}.<br />
      ➤ {t('shareResidue')} {t('withGranddaughters')}; {t('eachGrandsonGetsTwiceTheShareOfAGranddaughter')}.<br />
      ➤ {t('blockSiblingsUnclesNephewsCousinsAndGrandfather')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:11; Tafsir Ibn Abbas; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanbali Fiqh: "Al-Mughni" by Ibn Qudamah]
      </span>
    </li>
    <li>
      <strong>{t('granddaughters')}:</strong><br />
      ➤ {t('inheritOnlyIfTheirFatherIsDeceased')}.<br />
      ➤ {t('getFixedSharesIfNoGrandsons')}: {t('oneGranddaughterGetsHalf')}, {t('twoOrMoreGranddaughtersShareTwoThirds')}.<br />
      ➤ {t('shareResidue')} {t('withGrandsons')}; {t('eachGranddaughterReceivesHalfTheShareOfAGrandson')}.<br />
      ➤ {t('blockSiblingsUnclesNephewsCousinsAndGrandfather')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:11; Tafsir Al-Jalalayn; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanbali Fiqh: "Bidayat al-Mujtahid" by Ibn Rushd]
      </span>
    </li>
  </ul>

  {/* === New Section: Grandparents === */}
  <h3 className="text-lg font-semibold text-[#DC9B83] mt-6 mb-2">{t('grandparents')}</h3>
  <ul className="text-sm space-y-2 list-disc list-inside">
    <li>
      <strong>{t('grandfather')}:</strong><br />
      ➤ {t('blockedByFatherSonsGrandsonsAndDaughters')}.<br />
      ➤ {t('blocksHalfSiblingsUnclesNephewsAndCousins')}.<br />
      ➤ {t('inheritsResidueIfNoCloserHeirsExist')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:11; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Mabsut" by Al-Sarakhsi; Hanbali Fiqh: "Al-Mughni" by Ibn Qudamah]
      </span>
    </li>
    <li>
      <strong>{t('maternalGrandmother')}:</strong><br />
      ➤ {t('blockedByParentsChildrenGrandchildrenAndSiblings')}.<br />
      ➤ {t('blocksUnclesNephewsAndCousins')}.<br />
      ➤ {t('getsFixedShareOfOneSixthIfEligible')}.<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:11; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Hidayah" by Al-Marghinani]</span>
    </li>
    <li>
      <strong>{t('paternalGrandmother')}:</strong><br />
      ➤ {t('blockedByParentsChildrenGrandchildrenAndSiblings')}.<br />
      ➤ {t('blocksUnclesNephewsAndCousins')}.<br />
      ➤ {t('getsFixedShareOfOneSixthIfEligible')}.<br />
      <span className="text-[#9A9A9A]">[Surah An-Nisa 4:11; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Hidayah" by Al-Marghinani]</span>
    </li>
  </ul>

  {/* === New Section: Maternal & Paternal Siblings === */}
  <h3 className="text-lg font-semibold text-[#DC9B83] mt-6 mb-2">{t('maternalAndPaternalSiblings')}</h3>
  <ul className="text-sm space-y-2 list-disc list-inside">
    <li>
      <strong>{t('paternalBrothers')}:</strong><br />
      ➤ {t('blockedBySonsGrandsonsFatherAndFullBrothers')}.<br />
      ➤ {t('blocksMaternalSiblingsUnclesNephewsAndCousins')}.<br />
      ➤ {t('inheritsAsResiduaryHeirsWithTwoToOneRatio')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:11; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Hidayah" by Al-Marghinani]
      </span>
    </li>
    <li>
      <strong>{t('paternalSisters')}:</strong><br />
      ➤ {t('blockedBySonsGrandsonsFatherFullBrothersSistersAndGrandfather')}.<br />
      ➤ {t('blocksMaternalSiblingsUnclesNephewsAndCousins')}.<br />
      ➤ {t('inheritsAsResiduaryHeirsWithOneToOneRatio')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:11; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Hidayah" by Al-Marghinani]
      </span>
    </li>
    <li>
      <strong>{t('maternalBrothers')}:</strong><br />
      ➤ {t('blockedBySonsDaughtersFatherFullBrothersSistersGrandfatherGrandsonsAndPaternalSiblings')}.<br />
      ➤ {t('blocksUnclesNephewsAndCousins')}.<br />
      ➤ {t('getsFixedShareOfOneSixthCollectively')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:12; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Hidayah" by Al-Marghinani]
      </span>
    </li>
    <li>
      <strong>{t('maternalSisters')}:</strong><br />
      ➤ {t('blockedBySonsDaughtersFatherGrandfatherFullBrothersPaternalUnclesAndPaternalSiblings')}.<br />
      ➤ {t('blocksUnclesNephewsAndCousins')}.<br />
      ➤ {t('getsFixedShareOfOneSixthCollectively')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:12; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Hidayah" by Al-Marghinani]
      </span>
    </li>
  </ul>

  {/* === New Section: Nephews === */}
  <h3 className="text-lg font-semibold text-[#DC9B83] mt-6 mb-2">{t('nephews')}</h3>
  <ul className="text-sm space-y-2 list-disc list-inside">
    <li>
      <strong>{t('fullNephews')}:</strong><br />
      ➤ {t('inheritOnlyIfSonsOfTheDeceasedAreDeceased')}.<br />
      ➤ {t('shareTheResidueWithNieces')}; {t('eachNephewGetsTwiceTheShareOfANiece')}.<br />
      ➤ {t('blockedIfTheDeceasedSonsAreAlive')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:11; Tafsir Ibn Abbas; Maliki Fiqh: "Al-Iqna'"; Hanbali Fiqh: "Al-Mughni"]
      </span>
    </li>
    <li>
      <strong>{t('paternalNephews')}:</strong><br />
      ➤ {t('inheritOnlyIfSonsOfTheDeceasedAndFullNephewsAreDeceased')}.<br />
      ➤ {t('shareResidueSimilarlyWithFullNephews')}.<br />
      ➤ {t('blockedByPresenceOfSonsOrFullNephews')}.<br />
      <span className="text-[#9A9A9A]">
        [Maliki Fiqh: "Al-Iqna'"; Hanafi Fiqh: "Al-Mabsut"; Hanbali Fiqh: "Al-Mughni"]
      </span>
    </li>
  </ul>

  {/* === New Section: Uncles === */}
  <h3 className="text-lg font-semibold text-[#DC9B83] mt-6 mb-2">{t('uncles')}</h3>
  <ul className="text-sm space-y-2 list-disc list-inside">
    <li>
      <strong>{t('fullUncles')}:</strong><br />
      ➤ {t('inheritOnlyIfTheFatherIsDeceasedAndNoSonsOrDaughtersExist')}
      <br />
      ➤ {t('doNotInheritIfTheGrandfatherIsAlive')} (grandfather blocks full uncles).<br />
      ➤ {t('takeTheResidue')} (remaining estate) {t('asResiduaryHeirsAsaba')}.<br />
      <span className="text-[#9A9A9A]">
        [Surah An-Nisa 4:11, 4:12; Tafsir Ibn Kathir; Maliki Fiqh: "Al-Iqna'"; Hanafi Fiqh: "Al-Mabsut" by Al-Sarakhsi]
      </span>
    </li>
    <li>
      <strong>{t('paternalUncles')}:</strong><br />
      ➤ {t('inheritOnlyIfTheFatherAndFullUnclesAreDeceasedAndNoSonsOrDaughtersExist')}
      <br />
      ➤ {t('takeResidueAsResiduaryHeirs')}.<br />
      ➤ {t('blockedByPresenceOfFatherSonsDaughtersOrFullUncles')}.<br />
      <span className="text-[#9A9A9A]">
        [Maliki Fiqh: "Al-Iqna'"; Hanafi Fiqh: "Al-Mabsut"; Hanbali Fiqh: "Al-Mughni"]
      </span>
    </li>

  </ul>

  {/* === New Section: Cousins === */}
<h3 className="text-lg font-semibold text-[#DC9B83] mt-6 mb-2">{t('cousins')}</h3>
<ul className="text-sm space-y-2 list-disc list-inside">
  <li>
    <strong>{t('fullCousins')}:</strong><br />
    ➤ {t('inheritOnlyIfNoCloserHeirsExist')} (no father, children, siblings, nephews, or uncles).<br />
    ➤ {t('takeTheEntireResidueAsResiduaryHeirs')}.<br />
    <span className="text-[#9A9A9A]">
      [Quran 8:75; Hadith Sahih Muslim; Maliki Fiqh: "Al-Iqna'" by Al-Qarafi; Hanafi Fiqh: "Al-Hidayah" by Al-Marghinani]
    </span>
  </li>
  <li>
    <strong>{t('paternalCousins')}:</strong><br />
    ➤ {t('inheritOnlyIfNoCloserHeirsAndNoFullCousinsExist')}.<br />
    ➤ {t('takeResidueAsResiduaryHeirsIfEligible')}.<br />
    <span className="text-[#9A9A9A]">
      [Quran 4:12, 4:176; Tafsir Ibn Kathir; Hanbali Fiqh: "Al-Mughni" by Ibn Qudamah]
    </span>
  </li>
  <li>
    <em>{t('note')}:</em> {t('cousinsArePartOfDhawuAlArham')} (distant kindred) and {t('inheritOnlyInAbsenceOfCloserHeirs')}.<br />
    {t('consultAQualifiedScholarForComplexCases')}.
  </li>
</ul>


  <p className="mt-4 text-xs text-[#9A9A9A]">
    {t('complexCasesConsultAQualifiedIslamicScholar')}
  </p>
</div>


        {/* MIDDLE - Calculator Form + Result */}
        <div
          ref={printRef}
          className="flex-[2] bg-[#FFFFFF] border border-[#E8BCA8] rounded-lg shadow-md p-4 sm:p-6 max-w-full"
        >
          {/* Estate Amount */}
          <div className="mb-6">
            <label className="block font-medium text-[#4A4A4A] mb-1" htmlFor="estateAmount">
              {t('totalEstateAmount')}:
            </label>
            <input
              type="number"
              min={0}
              id="estateAmount"
              value={estateAmount}
              onChange={(e) => setEstateAmount(e.target.value)}
              placeholder={t('enterEstateAmount')}
              className="w-full border border-[#E8BCA8] rounded px-3 py-2"
            />
            <p className="text-sm text-[#9A9A9A] mt-1">{t('leaveEmptyToGetPercentageSharesOnly')}</p>
          </div>

          {/* ==== Primary Heirs Section ==== */}
          <div className="mb-8 border-b border-[#E8BCA8] pb-6">
            <h2 className="text-2xl font-semibold text-[#DC9B83] mb-4">{t('primaryHeirs')}</h2>

            {/* Spouse */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-medium text-[#4A4A4A]">{t('numberOfWives')}:</label>
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={wives}
                  onChange={(e) => handleNumberChange('wives', e.target.value, setWives, { min: 0, max: 4 })}
                  onBlur={() => { markTouched('wives'); validateNumber('wives', wives, { min: 0, max: 4 }); }}
                  className={`w-full border rounded px-3 py-2 ${errors.wives ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                  disabled={husbandAlive}
                />
                {renderError('wives')}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={husbandAlive}
                  onChange={(e) => setHusbandAlive(e.target.checked)}
                  id="husbandAlive"
                  className="w-4 h-4 accent-[#DC9B83]"
                  disabled={wives > 0}
                />
                <label htmlFor="husbandAlive" className="font-medium text-[#4A4A4A]">
                  {t('husbandAlive')}
                </label>
              </div>
            </div>

            {/* Children */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-medium text-[#4A4A4A]">{t('numberOfSons')}:</label>
                <input
                  type="number"
                  min={0}
                  value={sons}
                  onChange={(e) => handleNumberChange('sons', e.target.value, setSons)}
                  onBlur={() => { markTouched('sons'); validateNumber('sons', sons, { min: 0 }); }}
                  className={`w-full border rounded px-3 py-2 ${errors.sons ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                />
                {renderError('sons')}
              </div>
              <div>
                <label className="block font-medium text-[#4A4A4A]">{t('numberOfDaughters')}:</label>
                <input
                  type="number"
                  min={0}
                  value={daughters}
                  onChange={(e) => handleNumberChange('daughters', e.target.value, setDaughters)}
                  onBlur={() => { markTouched('daughters'); validateNumber('daughters', daughters, { min: 0 }); }}
                  className={`w-full border rounded px-3 py-2 ${errors.daughters ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                />
                {renderError('daughters')}
              </div>
            </div>

            {/* Parents */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={motherAlive}
                  onChange={(e) => setMotherAlive(e.target.checked)}
                  id="motherAlive"
                  className="w-4 h-4 accent-[#DC9B83]"
                />
                <label htmlFor="motherAlive" className="font-medium text-[#4A4A4A]">
                  {t('motherAlive')}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={fatherAlive}
                  onChange={(e) => setFatherAlive(e.target.checked)}
                  id="fatherAlive"
                  className="w-4 h-4 accent-[#DC9B83]"
                />
                <label htmlFor="fatherAlive" className="font-medium text-[#4A4A4A]">
                  {t('fatherAlive')}
                </label>
              </div>
            </div>

            {/* Siblings */}
            <div className="space-y-4 mb-6 border-t border-[#E8BCA8] pt-4">
              <h3 className="text-xl font-semibold text-[#DC9B83] mb-2">{t('siblings')}</h3>
              <div>
                <label className="block font-medium text-[#4A4A4A]">{t('numberOfBrothers')}:</label>
                <input
                  type="number"
                  min={0}
                  value={brothers}
                  onChange={(e) => handleNumberChange('brothers', e.target.value, setBrothers)}
                  onBlur={() => { markTouched('brothers'); validateNumber('brothers', brothers, { min: 0 }); }}
                  className={`w-full border rounded px-3 py-2 ${errors.brothers ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                />
                {renderError('brothers')}
              </div>
              <div>
                <label className="block font-medium text-[#4A4A4A]">{t('numberOfSisters')}:</label>
                <input
                  type="number"
                  min={0}
                  value={sisters}
                  onChange={(e) => handleNumberChange('sisters', e.target.value, setSisters)}
                  onBlur={() => { markTouched('sisters'); validateNumber('sisters', sisters, { min: 0 }); }}
                  className={`w-full border rounded px-3 py-2 ${errors.sisters ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                />
                {renderError('sisters')}
              </div>
            </div>
          </div>

          {/* ==== Residuary Heirs (Asaba) Section - collapsible ==== */}
          <div className="mb-8 border-b border-[#E8BCA8] pb-6">
            <h2
              className="text-2xl font-semibold text-[#DC9B83] mb-4 cursor-pointer select-none"
              onClick={() => setIsAsabaOpen(!isAsabaOpen)}
              aria-expanded={isAsabaOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsAsabaOpen(!isAsabaOpen);
                }
              }}
            >
              {t('residuaryHeirsAsaba')} {isAsabaOpen ? "▲" : "▼"}
            </h2>
            {isAsabaOpen && (
              <>
                {/* Grandchildren */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-[#DC9B83] mb-2">{t('grandchildren')}</h3>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('grandsons')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={grandsons}
                      onChange={(e) => handleNumberChange('grandsons', e.target.value, setGrandsons)}
                      onBlur={() => { markTouched('grandsons'); validateNumber('grandsons', grandsons, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.grandsons ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('grandsons')}
                  </div>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('granddaughters')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={granddaughters}
                      onChange={(e) => handleNumberChange('granddaughters', e.target.value, setGranddaughters)}
                      onBlur={() => { markTouched('granddaughters'); validateNumber('granddaughters', granddaughters, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.granddaughters ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('granddaughters')}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ==== Distant Kindred (Dhawu al-Arham) Section - collapsible ==== */}
          <div>
            <h2
              className="text-2xl font-semibold text-[#DC9B83] mb-4 cursor-pointer select-none"
              onClick={() => setIsDhawuOpen(!isDhawuOpen)}
              aria-expanded={isDhawuOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsDhawuOpen(!isDhawuOpen);
                }
              }}
            >
              {t('distantKindredDhawuAlArham')} {isDhawuOpen ? "▲" : "▼"}
            </h2>
            {isDhawuOpen && (
              <>
                {/* Grandparents */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-[#DC9B83] mb-2">{t('grandparents')}</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={grandfatherAlive}
                      onChange={(e) => setGrandfatherAlive(e.target.checked)}
                      id="grandfatherAlive"
                      className="w-4 h-4 accent-[#DC9B83]"
                    />
                    <label htmlFor="grandfatherAlive" className="font-medium text-[#4A4A4A]">
                      {t('grandfatherAlive')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={maternalGrandmotherAlive}
                      onChange={(e) => setMaternalGrandmotherAlive(e.target.checked)}
                      id="maternalGrandmotherAlive"
                      className="w-4 h-4 accent-[#DC9B83]"
                    />
                    <label htmlFor="maternalGrandmotherAlive" className="font-medium text-[#4A4A4A]">
                      {t('maternalGrandmotherAlive')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={paternalGrandmotherAlive}
                      onChange={(e) => setPaternalGrandmotherAlive(e.target.checked)}
                      id="paternalGrandmotherAlive"
                      className="w-4 h-4 accent-[#DC9B83]"
                    />
                    <label htmlFor="paternalGrandmotherAlive" className="font-medium text-[#4A4A4A]">
                      {t('paternalGrandmotherAlive')}
                    </label>
                  </div>
                </div>

                {/* Maternal and Paternal Siblings */}
                <div className="space-y-4 mb-6 border-t border-[#E8BCA8] pt-4">
                  <h3 className="text-xl font-semibold text-[#DC9B83] mb-2">{t('maternalAndPaternalSiblings')}</h3>
                  
                  {/* Maternal Siblings */}
                  <div className="space-y-4 mb-4">
                    <h4 className="text-lg font-medium text-[#4A4A4A]">{t('maternalSiblings')}</h4>
                    <div>
                      <label className="block font-medium text-[#4A4A4A]">{t('numberOfMaternalBrothers')}:</label>
                      <input
                        type="number"
                        min={0}
                        value={maternalBrothers}
                        onChange={(e) => handleNumberChange('maternalBrothers', e.target.value, setMaternalBrothers)}
                        onBlur={() => { markTouched('maternalBrothers'); validateNumber('maternalBrothers', maternalBrothers, { min: 0 }); }}
                        className={`w-full border rounded px-3 py-2 ${errors.maternalBrothers ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                      />
                      {renderError('maternalBrothers')}
                    </div>
                    <div>
                      <label className="block font-medium text-[#4A4A4A]">{t('numberOfMaternalSisters')}:</label>
                      <input
                        type="number"
                        min={0}
                        value={maternalSisters}
                        onChange={(e) => handleNumberChange('maternalSisters', e.target.value, setMaternalSisters)}
                        onBlur={() => { markTouched('maternalSisters'); validateNumber('maternalSisters', maternalSisters, { min: 0 }); }}
                        className={`w-full border rounded px-3 py-2 ${errors.maternalSisters ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                      />
                      {renderError('maternalSisters')}
                    </div>
                  </div>

                  {/* Paternal Siblings */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-[#4A4A4A]">{t('paternalSiblings')}</h4>
                    <div>
                      <label className="block font-medium text-[#4A4A4A]">{t('numberOfPaternalBrothers')}:</label>
                      <input
                        type="number"
                        min={0}
                        value={paternalBrothers}
                        onChange={(e) => handleNumberChange('paternalBrothers', e.target.value, setPaternalBrothers)}
                        onBlur={() => { markTouched('paternalBrothers'); validateNumber('paternalBrothers', paternalBrothers, { min: 0 }); }}
                        className={`w-full border rounded px-3 py-2 ${errors.paternalBrothers ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                      />
                      {renderError('paternalBrothers')}
                    </div>
                    <div>
                      <label className="block font-medium text-[#4A4A4A]">{t('numberOfPaternalSisters')}:</label>
                      <input
                        type="number"
                        min={0}
                        value={paternalSisters}
                        onChange={(e) => handleNumberChange('paternalSisters', e.target.value, setPaternalSisters)}
                        onBlur={() => { markTouched('paternalSisters'); validateNumber('paternalSisters', paternalSisters, { min: 0 }); }}
                        className={`w-full border rounded px-3 py-2 ${errors.paternalSisters ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                      />
                      {renderError('paternalSisters')}
                    </div>
                  </div>
                </div>

                {/* Nephews */}
                <div className="space-y-4 mb-6 border-t border-[#E8BCA8] pt-4">
                  <h3 className="text-xl font-semibold text-[#DC9B83] mb-2">{t('nephews')}</h3>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('numberOfFullNephews')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={fullNephews}
                      onChange={(e) => handleNumberChange('fullNephews', e.target.value, setFullNephews)}
                      onBlur={() => { markTouched('fullNephews'); validateNumber('fullNephews', fullNephews, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.fullNephews ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('fullNephews')}
                  </div>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('numberOfPaternalNephews')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={paternalNephews}
                      onChange={(e) => handleNumberChange('paternalNephews', e.target.value, setPaternalNephews)}
                      onBlur={() => { markTouched('paternalNephews'); validateNumber('paternalNephews', paternalNephews, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.paternalNephews ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('paternalNephews')}
                  </div>
                </div>

                {/* Uncles */}
                <div className="space-y-4 mb-6 border-t border-[#E8BCA8] pt-4">
                  <h3 className="text-xl font-semibold text-[#DC9B83] mb-2">{t('uncles')}</h3>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('numberOfFullUncles')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={fullUncles}
                      onChange={(e) => handleNumberChange('fullUncles', e.target.value, setFullUncles)}
                      onBlur={() => { markTouched('fullUncles'); validateNumber('fullUncles', fullUncles, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.fullUncles ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('fullUncles')}
                  </div>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('numberOfPaternalUncles')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={paternalUncles}
                      onChange={(e) => handleNumberChange('paternalUncles', e.target.value, setPaternalUncles)}
                      onBlur={() => { markTouched('paternalUncles'); validateNumber('paternalUncles', paternalUncles, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.paternalUncles ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('paternalUncles')}
                  </div>
                </div>

                {/* Cousins */}
                <div className="space-y-4 mb-6 border-t border-[#E8BCA8] pt-4">
                  <h3 className="text-xl font-semibold text-[#DC9B83] mb-2">{t('cousins')}</h3>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('numberOfFullCousins')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={fullCousins}
                      onChange={(e) => handleNumberChange('fullCousins', e.target.value, setFullCousins)}
                      onBlur={() => { markTouched('fullCousins'); validateNumber('fullCousins', fullCousins, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.fullCousins ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('fullCousins')}
                  </div>
                  <div>
                    <label className="block font-medium text-[#4A4A4A]">{t('numberOfPaternalCousins')}:</label>
                    <input
                      type="number"
                      min={0}
                      value={paternalCousins}
                      onChange={(e) => handleNumberChange('paternalCousins', e.target.value, setPaternalCousins)}
                      onBlur={() => { markTouched('paternalCousins'); validateNumber('paternalCousins', paternalCousins, { min: 0 }); }}
                      className={`w-full border rounded px-3 py-2 ${errors.paternalCousins ? 'border-red-400' : 'border-[#E8BCA8]'}`}
                    />
                    {renderError('paternalCousins')}
                  </div>
                </div>
              </>
            )}
          </div>

        {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-6">
            <button
              className="bg-[#4A4A4A] text-white px-5 py-2 rounded hover:bg-[#DB8D73] transition"
              onClick={handleCalculate}
              disabled={estateAmount !== "" && !isEstateAmountValid}
            >
              {t('calculate')}
            </button>
            <button
              className="bg-[#E3A48E] text-white px-5 py-2 rounded hover:bg-[#DB8D73] transition"
              onClick={handleReset}
            >
              {t('reset')}
            </button>
            {result && (
              <button
                className="bg-[#DC9B83] text-white px-5 py-2 rounded hover:bg-[#B9745B] transition"
                onClick={handlePrint}
              >
                {t('printResult')}
              </button>
            )}
          </div>

          {/* Results */}
        {result && (
  <div className="mt-8 bg-[#FAFAFA] border border-[#E8BCA8] rounded p-4">
    <h2 className="text-2xl font-semibold text-[#DC9B83] mb-4">{t('calculationResult')}</h2>
    <div>
      {(() => {
        // Clone and flatten wifeShares
        const displayResult = { ...result };
        if (result.wifeShares && result.wifeShares.length > 0) {
          result.wifeShares.forEach((share, index) => {
            displayResult[`wife ${index + 1}`] = share;
          });
          // Optionally delete combined wives share to avoid double print
          delete displayResult.wives;
        }
        return Object.entries(displayResult)
          .filter(([key, share]) =>
            share > 0 &&
            key !== "wivesEach" &&
            key !== "sonsEach" &&
            key !== "daughtersEach" &&
            key !== "brothersEach" &&
            key !== "sistersEach" &&
            key !== "paternalBrothersEach" &&
            key !== "paternalSistersEach" &&
            key !== "grandsonsEach" &&
            key !== "granddaughtersEach" &&
            key !== "maternalBrothersEach" &&
            key !== "maternalSistersEach" &&
            key !== "fullNephewsEach" &&
            key !== "paternalNephewsEach" &&
            key !== "fullUnclesEach" &&
            key !== "paternalUnclesEach" &&
            key !== "fullCousinsEach" &&
            key !== "paternalCousinsEach"
          )
          .map(([heir, share]) => {
            if (heir === "wives" && result.wivesEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachWife')}: ${formatMoney(result.wivesEach * Number(estateAmount))} / ${(result.wivesEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachWife')}: ${(result.wivesEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "sons" && result.sonsEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachSon')}: ${formatMoney(result.sonsEach * Number(estateAmount))} / ${(result.sonsEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachSon')}: ${(result.sonsEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "daughters" && result.daughtersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachDaughter')}: ${formatMoney(result.daughtersEach * Number(estateAmount))} / ${(result.daughtersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachDaughter')}: ${(result.daughtersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "brothers" && result.brothersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachBrother')}: ${formatMoney(result.brothersEach * Number(estateAmount))} / ${(result.brothersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachBrother')}: ${(result.brothersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "sisters" && result.sistersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachSister')}: ${formatMoney(result.sistersEach * Number(estateAmount))} / ${(result.sistersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachSister')}: ${(result.sistersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "maternalBrothers" && result.maternalBrothersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachMaternalBrother')}: ${formatMoney(result.maternalBrothersEach * Number(estateAmount))} / ${(result.maternalBrothersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachMaternalBrother')}: ${(result.maternalBrothersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "maternalSisters" && result.maternalSistersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachMaternalSister')}: ${formatMoney(result.maternalSistersEach * Number(estateAmount))} / ${(result.maternalSistersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachMaternalSister')}: ${(result.maternalSistersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "paternalBrothers" && result.paternalBrothersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachPaternalBrother')}: ${formatMoney(result.paternalBrothersEach * Number(estateAmount))} / ${(result.paternalBrothersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachPaternalBrother')}: ${(result.paternalBrothersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "paternalSisters" && result.paternalSistersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachPaternalSister')}: ${formatMoney(result.paternalSistersEach * Number(estateAmount))} / ${(result.paternalSistersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachPaternalSister')}: ${(result.paternalSistersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "fullNephews" && result.fullNephewsEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachFullNephew')}: ${formatMoney(result.fullNephewsEach * Number(estateAmount))} / ${(result.fullNephewsEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachFullNephew')}: ${(result.fullNephewsEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "paternalNephews" && result.paternalNephewsEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachPaternalNephew')}: ${formatMoney(result.paternalNephewsEach * Number(estateAmount))} / ${(result.paternalNephewsEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachPaternalNephew')}: ${(result.paternalNephewsEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "fullUncles" && result.fullUnclesEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachFullUncle')}: ${formatMoney(result.fullUnclesEach * Number(estateAmount))} / ${(result.fullUnclesEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachFullUncle')}: ${(result.fullUnclesEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "paternalUncles" && result.paternalUnclesEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachPaternalUncle')}: ${formatMoney(result.paternalUnclesEach * Number(estateAmount))} / ${(result.paternalUnclesEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachPaternalUncle')}: ${(result.paternalUnclesEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "fullCousins" && result.fullCousinsEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachFullCousin')}: ${formatMoney(result.fullCousinsEach * Number(estateAmount))} / ${(result.fullCousinsEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachFullCousin')}: ${(result.fullCousinsEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "paternalCousins" && result.paternalCousinsEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachPaternalCousin')}: ${formatMoney(result.paternalCousinsEach * Number(estateAmount))} / ${(result.paternalCousinsEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachPaternalCousin')}: ${(result.paternalCousinsEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "grandsons" && result.grandsonsEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachGrandson')}: ${formatMoney(result.grandsonsEach * Number(estateAmount))} / ${(result.grandsonsEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachGrandson')}: ${(result.grandsonsEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "granddaughters" && result.granddaughtersEach) {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%) (${t('eachGranddaughter')}: ${formatMoney(result.granddaughtersEach * Number(estateAmount))} / ${(result.granddaughtersEach * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}% (${t('eachGranddaughter')}: ${(result.granddaughtersEach * 100).toFixed(2)}%)`}
                  </span>
                </div>
              );
            }
            if (heir === "baytulmal") {
              return (
                <div
                  key={heir}
                  className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
                >
                  <span className="capitalize font-medium text-[#4A4A4A]">
                    {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <span className="font-semibold text-[#4A4A4A]">
                    {isEstateAmountValid
                      ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%)`
                      : `${(share * 100).toFixed(2)}%`}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={heir}
                className="mb-2 flex justify-between border-b border-[#E8BCA8] pb-2"
              >
                <span className="capitalize font-medium text-[#4A4A4A]">
                  {heir.replace(/([A-Z])/g, " $1").toLowerCase()}
                </span>
                <span className="font-semibold text-[#4A4A4A]">
                  {isEstateAmountValid
                    ? `${formatMoney(share * Number(estateAmount))} (${(share * 100).toFixed(2)}%)`
                    : `${(share * 100).toFixed(2)}%`}
                </span>
              </div>
            );
          });
      })()}
    </div>
  </div>
)}

        </div>

        


            {/* RIGHT - Tips Panel */}
          <div className="flex-1 bg-[#FFFFFF] border border-[#E8BCA8] rounded-lg shadow-md p-6 min-w-[260px] sm:min-w-[280px] max-w-full lg:max-w-[320px] text-[#4A4A4A] overflow-y-auto max-h-[calc(90vh)]">
            <h2 className="text-2xl font-semibold text-[#DC9B83] mb-4">{t('qualificationAndTips')}</h2>
           <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{t('selectOnlyTheHeirsWhoAreAliveAtTheTimeOfDeath')}</li>
            <li>{t('onlyOneOfHusbandOrWivesCanBeSelected')}</li>
            <li>{t('enterExactNumbersForEachHeir')}</li>
            <li>{t('leaveEstateAmountBlankToCalculateByPercentage')}</li>
            <li>{t('grandchildrenInheritOnlyIfTheirParentIsDeceased')}</li>
            <li>{t('granddaughtersGetFixedSharesIfNoGrandsonsExist')}</li>
            <li>{t('granddaughtersBlockSiblingsUnclesNephewsCousinsAndGrandfather')}</li>
            <li>{t('fatherOrMotherMayBlockSiblingsAndGrandparents')}</li>
            <li>{t('useSiblingsOnlyIfThereAreNoSonsGrandsonsOrFather')}</li>
            <li>{t('useGrandparentsOnlyIfThereAreNoParentsChildrenOrSiblings')}</li>
            <li>{t('consultAScholarForComplexOrDisputedCases')}</li>
            <li>{t('maternalBrothersAndSistersShare⅙CollectivelyIfNoParentsChildrenGrandchildrenOrFullSiblings')}</li>
            <li>{t('paternalBrothersAndSistersInheritResidueIfNoFatherChildrenOrFullSiblingsBrothersGetDoubleTheShareOfSisters')}</li>
            <li>{t('fullNephewsInheritOnlyIfTheDeceasedSonsAreNotAlive')}</li>
            <li>{t('paternalNephewsInheritOnlyIfSonsAndFullNephewsAreAbsent')}</li>
            <li>{t('fullUnclesInheritOnlyIfTheFatherIsDeceasedAndNoChildrenExist')}</li>
            <li>{t('grandfatherBlocksFullUnclesFromInheriting')}</li>
            <li>{t('paternalUnclesInheritOnlyIfFatherFullUnclesAndChildrenAreAbsent')}</li>
            <li>{t('maternalUnclesDoNotBlockOrGetBlockedByPaternalUnclesOrBrothers')}</li>
            <li>{t('presenceOfFatherSonsOrGrandfatherCanBlockNephewsAndUnclesAccordingToShariahRules')}</li>
            <li>{t('consultAQualifiedIslamicScholarForComplexOrDisputedInheritanceCases')}</li>
            <li>{t('fullCousinsInheritOnlyIfTheirCommonAncestor')} (e.g., {t('grandparent')}) {t('isDeceased')} {t('andNoCloserHeirsExist')}</li>
            <li>{t('paternalCousinsInheritOnlyIfFatherFullUnclesAndFullCousinsAreAbsent')}</li>
            <li>{t('cousinsTypicallyInheritAsDistantKindredDhawuAlArhamAndHaveLimitedSharesUnderIslamicInheritance')}</li>
            <li>{t('presenceOfCloserHeirsLikeSiblingsUnclesOrGrandparentsUsuallyBlocksCousinsFromInheriting')}</li>
            <li>{t('consultAQualifiedIslamicScholarForPreciseRulingsOnCousinInheritanceAsInterpretationsVary')}</li>
          </ul>
        </div>
      </div>
    </div>

    
  );
};

export default HeirFormSection1;
