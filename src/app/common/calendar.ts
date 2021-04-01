import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Calendar {
  public geoMonths: Object[] = [
    { index: 1, value: "იანვარი" },
    { index: 2, value: "თებერვალი" },
    { index: 3, value: "მარტი" },
    { index: 4, value: "აპრილი" },
    { index: 5, value: "მაისი" },
    { index: 6, value: "ივნისი" },
    { index: 7, value: "ივლისი" },
    { index: 8, value: "აგვისტო" },
    { index: 9, value: "სექტემბერი" },
    { index: 10, value: "ოქტომბერი" },
    { index: 11, value: "ნოემბერი" },
    { index: 12, value: "დეკემბერი" },
  ];
  public toDate(dateStr: string) {
    if (dateStr == "" || dateStr == null) return "";
    return new Date(dateStr).toLocaleString();
  }
  public toGeoDate(dateStr: string) {
    if (dateStr == "" || dateStr == null) return "";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleString("ka-GE", options);
  }
}
