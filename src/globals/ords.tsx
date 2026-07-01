export type ProductCategory = {
  text: string;
  description: string;
  group: string;
};

const BicyclesCategories: ProductCategory[] = [
  {
    text: "E-bike component",
    description: "e.g. battery, controller, display for electric bicycles",
    group: "Bicycles",
  },
  { text: "Bicycle", description: "e.g. bicycle, electric bicycle, mountain bike", group: "Bicycles" },
];

const ClocksCategories: ProductCategory[] = [
  { text: "Clock", description: "e.g. battery or plug-in clocks", group: "Clocks" },
  { text: "Watch", description: "e.g. digital watches, fitness trackers", group: "Clocks" },
];

const ComputerEquipmentCategories: ProductCategory[] = [
  {
    text: "Battery/charger/adapter",
    description: "e.g. mobile phone charger, portable battery",
    group: "Computer equipment / phones",
  },
  {
    text: "Camera accessory",
    description: "e.g. lens, flash, battery grip, camera charger",
    group: "Computer equipment / phones",
  },
  {
    text: "Desktop computer",
    description: "e.g. tower, mini tower, midi tower, desktop",
    group: "Computer equipment / phones",
  },
  {
    text: "Digital compact camera",
    description: "e.g. smaller electronic cameras",
    group: "Computer equipment / phones",
  },
  { text: "Docking station", description: "Laptop dock or port replicator", group: "Computer equipment / phones" },
  { text: "DSLR/video camera", description: "e.g. larger electronic cameras", group: "Computer equipment / phones" },
  {
    text: "E-reader",
    description: "e.g. Kindle, Kobo, dedicated reading device",
    group: "Computer equipment / phones",
  },
  {
    text: "External storage",
    description: "e.g. external hard drive, SSD, USB flash drive",
    group: "Computer equipment / phones",
  },
  { text: "GPS / Satnav", description: "Standalone navigation device", group: "Computer equipment / phones" },
  { text: "Keyboard", description: "Wired or wireless computer keyboard", group: "Computer equipment / phones" },
  { text: "Laptop", description: "Portable computer", group: "Computer equipment / phones" },
  {
    text: "Mobile",
    description: "Any hand-held smartphone or other telecommunications device",
    group: "Computer equipment / phones",
  },
  { text: "Monitor", description: "Computer display not including a TV tuner", group: "Computer equipment / phones" },
  { text: "Mouse / Trackpad", description: "Pointing device for computers", group: "Computer equipment / phones" },
  {
    text: "Network accessory",
    description: "e.g. network switch, Wi-Fi extender, access point",
    group: "Computer equipment / phones",
  },
  {
    text: "Power supply unit",
    description: "External or internal power supply not tied to a specific device",
    group: "Computer equipment / phones",
  },
  {
    text: "Printer/scanner",
    description: "Any inkjet, laserjet, scanner, copier or combination appliance",
    group: "Computer equipment / phones",
  },
  {
    text: "Router / Modem",
    description: "Internet connectivity device, wired or wireless",
    group: "Computer equipment / phones",
  },
  { text: "Tablet", description: "e.g. Kindle, Fire, satnav", group: "Computer equipment / phones" },
  {
    text: "Tripod / Stabilizer",
    description: "Camera or phone support equipment, powered or electronic",
    group: "Computer equipment / phones",
  },
];

const DisplayAndSoundCategories: ProductCategory[] = [
  {
    text: "Audio interface / mixer",
    description: "e.g. USB audio interface, small mixing console",
    group: "Display and sound equipment",
  },
  {
    text: "Audio receiver / AV receiver",
    description: "e.g. home theater receiver, surround sound amplifier",
    group: "Display and sound equipment",
  },
  {
    text: "Bluetooth speaker",
    description: "Portable or plug-in wireless speaker",
    group: "Display and sound equipment",
  },
  {
    text: "CD / DVD / Blu-ray player",
    description: "Standalone media playback device",
    group: "Display and sound equipment",
  },
  {
    text: "Electronic musical accessory",
    description: "e.g. effects pedal, tuner, amplifier",
    group: "Display and sound equipment",
  },
  {
    text: "Flat screen TV",
    description: "e.g. television, smart TV, TV display",
    group: "Display and sound equipment",
  },
  {
    text: "Handheld entertainment device",
    description: "e.g. iPod, Walkman, Gameboy",
    group: "Display and sound equipment",
  },
  { text: "Headphones / Earbuds", description: "e.g. over-ear, earpods", group: "Display and sound equipment" },
  { text: "Hi-Fi integrated", description: "e.g. \u201cBoombox\u201d, stereo", group: "Display and sound equipment" },
  { text: "Hi-Fi separates", description: "e.g. amplifier, speaker, turntable", group: "Display and sound equipment" },
  {
    text: "Microphone",
    description: "e.g. USB microphone, wireless mic, karaoke mic",
    group: "Display and sound equipment",
  },
  {
    text: "Musical instrument",
    description: "Any powered instrument e.g. keyboard, guitar",
    group: "Display and sound equipment",
  },
  { text: "Portable radio", description: "e.g. radio alarm, transistor radio", group: "Display and sound equipment" },
  {
    text: "Projector",
    description: "e.g. slide projector, video projector, digital projector",
    group: "Display and sound equipment",
  },
  {
    text: "Soundbar",
    description: "Slim speaker designed for TV audio enhancement",
    group: "Display and sound equipment",
  },
  {
    text: "Turntable",
    description: "Record player, with or without built-in preamp",
    group: "Display and sound equipment",
  },
  {
    text: "TV and gaming-related accessories",
    description: "e.g. set-top box, DVD player, games controller",
    group: "Display and sound equipment",
  },
];

const HouseholdAppliancesElectricCategories: ProductCategory[] = [
  {
    text: "Aircon/dehumidifier",
    description: "Home/office appliance that adjusts ambient air quality",
    group: "Household appliances electric",
  },
  {
    text: "Blender / Food Processor",
    description: "e.g. blender, juicer, coffee grinder, stick blender, hand mixer",
    group: "Household appliances electric",
  },
  { text: "Breadmaker", description: "Kitchen appliance for baking bread", group: "Household appliances electric" },
  { text: "Clothes dryer", description: "e.g. dryer, tumble dryer", group: "Household appliances electric" },
  { text: "Clothes iron", description: "e.g. clothes iron, steam iron", group: "Household appliances electric" },
  { text: "Clothes washer", description: "e.g. washing machine, washer", group: "Household appliances electric" },
  {
    text: "Coffee maker",
    description: "e.g. Nespresso, electronic filter or espresso machine",
    group: "Household appliances electric",
  },
  { text: "Cordless vacuum", description: "Battery-powered vacuum cleaner", group: "Household appliances electric" },
  { text: "Corded vacuum", description: "Mains-powered vacuum cleaner", group: "Household appliances electric" },
  { text: "Curling iron", description: "Appliance for curling hair", group: "Household appliances electric" },
  {
    text: "Decorative or safety lights",
    description: "e.g. bike lights, fairy lights, Christmas lights",
    group: "Household appliances electric",
  },
  { text: "Electric toothbrush", description: "Battery or plug-in toothbrush", group: "Household appliances electric" },
  {
    text: "Emergency equipment",
    description: "e.g. emergency radio, flashlight, power lantern",
    group: "Household appliances electric",
  },
  { text: "Fan / Heater", description: "e.g. cooling fan, fan heater", group: "Household appliances electric" },
  {
    text: "Fitness electronics",
    description: "e.g. smart trainer, exercise bike console",
    group: "Household appliances electric",
  },
  {
    text: "Hair dryer",
    description: "Appliance for hair drying and styling with warm air",
    group: "Household appliances electric",
  },
  { text: "Induction cooktop", description: "Kitchen appliance for cooking", group: "Household appliances electric" },
  { text: "Kettle", description: "Kitchen appliance for boiling water", group: "Household appliances electric" },
  {
    text: "Kitchen appliance (heating)",
    description: "e.g. hot plate, electric griddle, slow cooker",
    group: "Household appliances electric",
  },
  {
    text: "Kitchen appliance (small)",
    description: "e.g. hand blender, milk frother, electric can opener",
    group: "Household appliances electric",
  },
  { text: "Lamp", description: "e.g. desk lamp, floor lamp", group: "Household appliances electric" },
  {
    text: "Large home electrical",
    description: "e.g lawnmower, fitness machine",
    group: "Household appliances electric",
  },
  {
    text: "Lighting control",
    description: "e.g. dimmer, timer, lighting controller",
    group: "Household appliances electric",
  },
  {
    text: "Medical device",
    description: "e.g. blood pressure monitor, thermometer, CPAP machine",
    group: "Household appliances electric",
  },
  {
    text: "Office equipment",
    description: "e.g. laminator, label maker, binding machine",
    group: "Household appliances electric",
  },
  {
    text: "Paper shredder",
    description: "Home/office appliance for shredding documents",
    group: "Household appliances electric",
  },
  {
    text: "Personal health device",
    description: "e.g. massage gun, TENS unit, heated pad",
    group: "Household appliances electric",
  },
  {
    text: "Popcorn machine",
    description: "Kitchen appliance for making popcorn",
    group: "Household appliances electric",
  },
  { text: "Refrigerator", description: "e.g. fridge, mini fridge", group: "Household appliances electric" },
  { text: "Rice cooker", description: "Kitchen appliance for cooking rice", group: "Household appliances electric" },
  { text: "Robot vacuum", description: "Automated vacuum cleaner", group: "Household appliances electric" },
  {
    text: "Scale",
    description: "e.g. bathroom scale, digital scale, digital kitchen scale",
    group: "Household appliances electric",
  },
  {
    text: "Security device",
    description: "e.g. security camera, video doorbell, alarm sensor",
    group: "Household appliances electric",
  },
  {
    text: "Sewing machine",
    description: "Home appliance for stitching fabric",
    group: "Household appliances electric",
  },
  { text: "Shaver", description: "e.g. electric shaver, beard trimmer", group: "Household appliances electric" },
  {
    text: "Slow cooker (crock pot)",
    description: "e.g. slow cooker, crock pot",
    group: "Household appliances electric",
  },
  {
    text: "Small home electrical",
    description: "e.g. baby monitor, doorbell, multimeter",
    group: "Household appliances electric",
  },
  {
    text: "Smart home device",
    description: "e.g. smart plug, smart bulb, smart thermostat, hub",
    group: "Household appliances electric",
  },
  {
    text: "Straightening iron",
    description: "Appliance for straightening hair",
    group: "Household appliances electric",
  },
  {
    text: "Toaster",
    description: "Kitchen appliance for browning baked goods",
    group: "Household appliances electric",
  },
  { text: "Wine cooler", description: "Refrigerator for storing wine", group: "Household appliances electric" },
];

const ToolsElectricCategories: ProductCategory[] = [
  { text: "Chainsaw", description: "e.g. gas or electric chainsaw", group: "Tools electric" },
  {
    text: "Electric scooter / mobility device",
    description: "e.g. e-scooter, powered mobility aid",
    group: "Tools electric",
  },
  { text: "Leaf blower", description: "e.g. gas or electric leaf blower", group: "Tools electric" },
  { text: "Power drill", description: "e.g. drill, cordless drill", group: "Tools electric" },
  { text: "Power tool", description: "Any powered DIY or gardening tool", group: "Tools electric" },
];

const ToolsNonElectricCategories: ProductCategory[] = [
  { text: "Hand tool", description: "e.g. screwdriver, wrench, pliers, hammer, etc.", group: "Tools non-electric" },
];

const ToysElectricCategories: ProductCategory[] = [
  {
    text: "Animatronics",
    description: "e.g. animatronic toy, animatronic animal, animatronic figure",
    group: "Toys electric",
  },
  { text: "Gaming console", description: "e.g. Playstation, XBox", group: "Toys electric" },
  { text: "Toy", description: "e.g. battery or plug-in toy", group: "Toys electric" },
];

const OtherCategories: ProductCategory[] = [
  { text: "Battery charger", description: "Dedicated charger for removable batteries", group: "Other" },
  { text: "Battery pack", description: "Rechargeable battery module or power bank", group: "Other" },
  { text: "Educational electronics", description: "e.g. learning toy, programmable kit, microscope", group: "Other" },
  { text: "Misc", description: "Any electronic device that does not fit in another category", group: "Other" },
  { text: "Payment / POS device", description: "e.g. card reader, receipt printer", group: "Other" },
  {
    text: "Test & measurement equipment",
    description: "e.g. oscilloscope, bench power supply, signal tester",
    group: "Other",
  },
];

export const ProductCategoryGroups: Record<string, ProductCategory[]> = {
  Bicycles: BicyclesCategories,
  Clocks: ClocksCategories,
  "Computer equipment / phones": ComputerEquipmentCategories,
  "Display and sound equipment": DisplayAndSoundCategories,
  "Household appliances electric": HouseholdAppliancesElectricCategories,
  "Tools electric": ToolsElectricCategories,
  "Tools non-electric": ToolsNonElectricCategories,
  "Toys electric": ToysElectricCategories,
  Other: OtherCategories,
};

const compareText = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

const sortCategories = (categories: ProductCategory[]) => [...categories].sort((a, b) => compareText(a.text, b.text));

export const ProductCategoryGroupNames = Object.keys(ProductCategoryGroups).sort(compareText);

export type ProductCategoryDropdownItem = {
  label: string;
  value: number | null;
  isGroupLabel?: boolean;
};

export const buildProductCategoryDropdownList = (): {
  selectableItems: { label: string; value: number }[];
  dropdownData: ProductCategoryDropdownItem[];
} => {
  const selectableItems: { label: string; value: number }[] = [];
  const dropdownData: ProductCategoryDropdownItem[] = [];

  for (const group of ProductCategoryGroupNames) {
    dropdownData.push({ label: group, value: null, isGroupLabel: true });
    for (const cat of sortCategories(ProductCategoryGroups[group])) {
      const value = selectableItems.length;
      const label = `${cat.text} (${cat.description})`;
      selectableItems.push({ label, value });
      dropdownData.push({ label, value });
    }
  }

  return { selectableItems, dropdownData };
};

export const ProductCategoryValues: ProductCategory[] = ProductCategoryGroupNames.flatMap((group) =>
  sortCategories(ProductCategoryGroups[group]),
);

export const MiscCategoryIdx = ProductCategoryValues.findIndex((category) => category.text === "Misc");

export const RepairStatusValues = ["In Queue", "In Progress", "Fixed", "Repairable", "End of life", "Unknown"];

export const RepairBarrierValues = [
  "Not applicable",
  "Spare parts not available",
  "Spare parts too expensive",
  "No way to open product",
  "Repair information not available",
  "Lack of equipment",
  "Item too worn out",
];
