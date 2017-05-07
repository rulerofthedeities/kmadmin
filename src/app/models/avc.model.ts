interface State {
  name: string;
  code: string;
}

interface Pos {
  type: string;
  coordinates: string[];
}

interface Polyline {
  type: string;
  coordinates: string[][];
}

interface TimeZone {
  offset: string;
  code: string;
  name: string;
  zone: string;
}

interface Currency {
  code: string;
  name: string;
}

interface Altitude {
  m: number;
  ft: number;
}

interface Location {
  descr: string;
  img?: string;
}

interface Affiliate {
  eanCityID?: string;
  viatorPage?: string;
  carRental?: string;
}

export interface City {
  _id?: string;
  alias: string;
  name: string;
  localName: string;
  state: State;
  country: string;
  publish: boolean;
  icon: string;
  flag: string;
  pos: Pos;
  intro: string;
  zoom: string;
  lan: string;
  language?: string;
  coordinates: string;
  timezone: TimeZone;
  currency: Currency;
  altitude: Altitude;
  location: Location;
  affiliate: Affiliate;
}

export interface Item {
  _id?: string;
  lan: string;
  alias: string;
  name: string;
  subTitle?: string;
  prefix?: string;
  description?: string;
  preview?: string;
  content?: string;
  address?: string;
  address_en?: string;
  location?: string;
  location_en?: string;
  metro?: string;
  metro_en?: string;
  pos?: Pos;
  polyline?: Polyline;
  thumb?: string;
  photo?: string;
  websites?: string[];
  categories?: string[];
  isPublished?: boolean;
  isTopAttraction?: boolean;
  isQuality?: boolean;
  photos?: string[];
  traffic?: number;
}
