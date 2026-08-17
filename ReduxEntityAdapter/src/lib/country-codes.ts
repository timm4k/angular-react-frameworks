interface CountryCode {
  code: string;
  label: string;
  dial: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "US", label: "United States", dial: "+1" },
  { code: "GB", label: "United Kingdom", dial: "+44" },
  { code: "UA", label: "Ukraine", dial: "+380" },
  { code: "DE", label: "Germany", dial: "+49" },
  { code: "FR", label: "France", dial: "+33" },
  { code: "IT", label: "Italy", dial: "+39" },
  { code: "ES", label: "Spain", dial: "+34" },
  { code: "PL", label: "Poland", dial: "+48" },
  { code: "NL", label: "Netherlands", dial: "+31" },
  { code: "SE", label: "Sweden", dial: "+46" },
  { code: "NO", label: "Norway", dial: "+47" },
  { code: "DK", label: "Denmark", dial: "+45" },
  { code: "FI", label: "Finland", dial: "+358" },
  { code: "PT", label: "Portugal", dial: "+351" },
  { code: "IE", label: "Ireland", dial: "+353" },
  { code: "CA", label: "Canada", dial: "+1" },
  { code: "AU", label: "Australia", dial: "+61" },
  { code: "JP", label: "Japan", dial: "+81" },
  { code: "KR", label: "South Korea", dial: "+82" },
  { code: "CN", label: "China", dial: "+86" },
  { code: "IN", label: "India", dial: "+91" },
  { code: "BR", label: "Brazil", dial: "+55" },
  { code: "MX", label: "Mexico", dial: "+52" },
  { code: "TR", label: "Turkey", dial: "+90" },
  { code: "IL", label: "Israel", dial: "+972" },
  { code: "AE", label: "UAE", dial: "+971" },
  { code: "SA", label: "Saudi Arabia", dial: "+966" },
  { code: "ZA", label: "South Africa", dial: "+27" },
  { code: "NG", label: "Nigeria", dial: "+234" },
  { code: "EG", label: "Egypt", dial: "+20" },
];
