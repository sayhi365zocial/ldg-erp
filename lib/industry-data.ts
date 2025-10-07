// Industry categories and subcategories
export const industries = [
  {
    category: "Agro & Food Industry",
    items: [
      "Agro & Food Industry - Agribusiness",
      "Agro & Food Industry - Food & Beverage",
    ]
  },
  {
    category: "Consumer Products",
    items: [
      "Consumer Products - Fashion",
      "Consumer Products - Home & Office Products",
      "Consumer Products - Personal Products & Pharmaceuticals",
    ]
  },
  {
    category: "Financials",
    items: [
      "Financials - Banking",
      "Financials - Finance & Securities",
      "Financials - Insurance",
    ]
  },
  {
    category: "Industrials",
    items: [
      "Industrials - Automotive",
      "Industrials - Industrial Materials & Machine",
      "Industrials - Packaging",
      "Industrials - Paper & Printing Materials",
      "Industrials - Petrochemicals & Chemicals",
      "Industrials - Steel & Metal Products",
    ]
  },
  {
    category: "Property & Construction",
    items: [
      "Property & Construction - Construction Materials",
      "Property & Construction - Construction Services",
      "Property & Construction - Property Development",
      "Property & Construction - Property Fund & Real Estate Investment Trusts",
    ]
  },
  {
    category: "Resources",
    items: [
      "Resources - Energy & Utilities",
      "Resources - Mining",
    ]
  },
  {
    category: "Services",
    items: [
      "Services - Commerce",
      "Services - Health Care Services",
      "Services - Media & Publishing",
      "Services - Professional Services",
      "Services - Tourisms & Leisure",
      "Services - Transportation & Logistics",
    ]
  },
  {
    category: "Technology",
    items: [
      "Technology - Electronic Components",
      "Technology - Information & Communication Technology",
    ]
  },
]

// Flat list for easy searching
export const industryList = industries.flatMap(group => group.items)
