const wallType = {
    concrete : "Stone, Bricks, Concrete or Cement",
    metalSheet : "Metal and/or Asbestos Sheets, on steel frame, stone pillars, steel supports",
    wooden : "Metal sheets, Asbestos Sheets on wooden frame work, wooden or similar ",
}

const  roofType = {
    slatesTiles: "Slates, Tiles, Metal Sheets, Asbestos and any other incombustible material ", 
    hardRoof : "Curved Hard and / or Hard Roof.",
    hardRoofSupercharged : "Hard roof, it thatched roof",
}

const floorType = {
    concrete : "Bricks, Stone, Cement, Concrete, Tiles (including Plastic Tiles), Timber",
    metalSheet : "Cement, Tiles, Timber.",
    wooden : "Cement, Tiles, Timber, earth or any combination of these",
}
const insurancePeriod = {
    oneYear : "1 Year",
    halfYear : "6 Months",
    threeMonths : "3 Months",
    other : "Other",
  }

  const fireApplicableLoadings = {
    areaDiscount: "Area Discount",
    branchDiscount: "Branch Discount",
    partnershipDiscount: "Partnership Discount",
    securityApplianceDiscount: "Security Appliance Discount",
    voulentaryExcessDiscount: "Voluntary Excess Discount",
    lossRatioDiscount: "Loss Ratio Discount",
    areaLoading: "Area Loading",
    fireProneLoad: "Fire Prone Load",
    poorHouseKeeping: "Poor House Keeping",
    areaDiscount1 : "In Addis Ababa and perfectly accessible and near for fire birgades",
    areaDiscount2 : "In Addis Ababa and accessible but not near fire birgades",
    areaDiscount3 : "In Big Towns and accessible and near for fire birgades in  Town",
    areaDiscount4 : "In Big Towns and accessible but not near for fire birgades in  Town",
    noAreaDiscount : "No, It's not accessible to fire birgades"
  };


  const alliedPerilsList = {
    aircraft : "Aircraft damage",
    impactDamage: "Impact damage",
    earthquake: "Earthquake",
    burstingAndOverflowing: "Bursting, or over flowing of water apparatus etc.",
    bushFire: "Bush Fire  Hazardous/ Non Hazardous",
    explosion: "Explosion",
    malicious: "Malicious Damage",
    spontaneous: "Spontaneous Combustion",
    storm: "Storm, Tempest & Flood",
    subsidence: "Subsidence and /or Collapse",
    sprinkler: "Sprinkler Leakage",
    smoke: "Smoke Damage",
    volcanic: "Volcanic Eruption",
    srcc: "SRCC",
  }

module.exports = {wallType, roofType, floorType, insurancePeriod, fireApplicableLoadings, alliedPerilsList}