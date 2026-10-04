"""
Build src/data/districts.ts from geoBoundaries gbOpen BGD ADM2 (simplified).
Boundaries (c) geoBoundaries (geoboundaries.org), CC BY 4.0.

Usage:  python3 scripts/build-districts.py path/to/geoBoundaries-BGD-ADM2_simplified.geojson
"""
import json, math, sys
from shapely.geometry import shape, MultiPolygon, Polygon

src = sys.argv[1]
g = json.load(open(src))

# geoBoundaries name -> (id, english, bangla, division id)
T = {
 "Dhaka": ("dhaka","Dhaka","ঢাকা","dhaka"),
 "Faridpur": ("faridpur","Faridpur","ফরিদপুর","dhaka"),
 "Gazipur": ("gazipur","Gazipur","গাজীপুর","dhaka"),
 "Gopalganj": ("gopalganj","Gopalganj","গোপালগঞ্জ","dhaka"),
 "Kishoreganj": ("kishoreganj","Kishoreganj","কিশোরগঞ্জ","dhaka"),
 "Madaripur": ("madaripur","Madaripur","মাদারীপুর","dhaka"),
 "Manikganj": ("manikganj","Manikganj","মানিকগঞ্জ","dhaka"),
 "Munshiganj": ("munshiganj","Munshiganj","মুন্সীগঞ্জ","dhaka"),
 "Narayanganj": ("narayanganj","Narayanganj","নারায়ণগঞ্জ","dhaka"),
 "Narsingdi": ("narsingdi","Narsingdi","নরসিংদী","dhaka"),
 "Rajbari": ("rajbari","Rajbari","রাজবাড়ী","dhaka"),
 "Shariatpur": ("shariatpur","Shariatpur","শরীয়তপুর","dhaka"),
 "Tangail": ("tangail","Tangail","টাঙ্গাইল","dhaka"),
 "Bandarban": ("bandarban","Bandarban","বান্দরবান","chattogram"),
 "Brahamanbaria": ("brahmanbaria","Brahmanbaria","ব্রাহ্মণবাড়িয়া","chattogram"),
 "Chandpur": ("chandpur","Chandpur","চাঁদপুর","chattogram"),
 "Chittagong": ("chattogram","Chattogram","চট্টগ্রাম","chattogram"),
 "Comilla": ("cumilla","Cumilla","কুমিল্লা","chattogram"),
 "Cox's Bazar": ("coxsbazar","Cox's Bazar","কক্সবাজার","chattogram"),
 "Feni": ("feni","Feni","ফেনী","chattogram"),
 "Khagrachhari": ("khagrachari","Khagrachari","খাগড়াছড়ি","chattogram"),
 "Lakshmipur": ("lakshmipur","Lakshmipur","লক্ষ্মীপুর","chattogram"),
 "Noakhali": ("noakhali","Noakhali","নোয়াখালী","chattogram"),
 "Rangamati": ("rangamati","Rangamati","রাঙ্গামাটি","chattogram"),
 "Habiganj": ("habiganj","Habiganj","হবিগঞ্জ","sylhet"),
 "Maulvibazar": ("moulvibazar","Moulvibazar","মৌলভীবাজার","sylhet"),
 "Sunamganj": ("sunamganj","Sunamganj","সুনামগঞ্জ","sylhet"),
 "Sylhet": ("sylhet","Sylhet","সিলেট","sylhet"),
 "Barguna": ("barguna","Barguna","বরগুনা","barishal"),
 "Barisal": ("barishal","Barishal","বরিশাল","barishal"),
 "Bhola": ("bhola","Bhola","ভোলা","barishal"),
 "Jhalokati": ("jhalokati","Jhalokati","ঝালকাঠি","barishal"),
 "Patuakhali": ("patuakhali","Patuakhali","পটুয়াখালী","barishal"),
 "Pirojpur": ("pirojpur","Pirojpur","পিরোজপুর","barishal"),
 "Bagerhat": ("bagerhat","Bagerhat","বাগেরহাট","khulna"),
 "Chuadanga": ("chuadanga","Chuadanga","চুয়াডাঙ্গা","khulna"),
 "Jessore": ("jashore","Jashore","যশোর","khulna"),
 "Jhenaidah": ("jhenaidah","Jhenaidah","ঝিনাইদহ","khulna"),
 "Khulna": ("khulna","Khulna","খুলনা","khulna"),
 "Kushtia": ("kushtia","Kushtia","কুষ্টিয়া","khulna"),
 "Magura": ("magura","Magura","মাগুরা","khulna"),
 "Meherpur": ("meherpur","Meherpur","মেহেরপুর","khulna"),
 "Narail": ("narail","Narail","নড়াইল","khulna"),
 "Satkhira": ("satkhira","Satkhira","সাতক্ষীরা","khulna"),
 "Bogra": ("bogura","Bogura","বগুড়া","rajshahi"),
 "Joypurhat": ("joypurhat","Joypurhat","জয়পুরহাট","rajshahi"),
 "Naogaon": ("naogaon","Naogaon","নওগাঁ","rajshahi"),
 "Natore": ("natore","Natore","নাটোর","rajshahi"),
 "Nawabganj": ("chapainawabganj","Chapainawabganj","চাঁপাইনবাবগঞ্জ","rajshahi"),
 "Pabna": ("pabna","Pabna","পাবনা","rajshahi"),
 "Rajshahi": ("rajshahi","Rajshahi","রাজশাহী","rajshahi"),
 "Sirajganj": ("sirajganj","Sirajganj","সিরাজগঞ্জ","rajshahi"),
 "Dinajpur": ("dinajpur","Dinajpur","দিনাজপুর","rangpur"),
 "Gaibandha": ("gaibandha","Gaibandha","গাইবান্ধা","rangpur"),
 "Kurigram": ("kurigram","Kurigram","কুড়িগ্রাম","rangpur"),
 "Lalmonirhat": ("lalmonirhat","Lalmonirhat","লালমনিরহাট","rangpur"),
 "Nilphamari": ("nilphamari","Nilphamari","নীলফামারী","rangpur"),
 "Panchagarh": ("panchagarh","Panchagarh","পঞ্চগড়","rangpur"),
 "Rangpur": ("rangpur","Rangpur","রংপুর","rangpur"),
 "Thakurgaon": ("thakurgaon","Thakurgaon","ঠাকুরগাঁও","rangpur"),
 "Jamalpur": ("jamalpur","Jamalpur","জামালপুর","mymensingh"),
 "Mymensingh": ("mymensingh","Mymensingh","ময়মনসিংহ","mymensingh"),
 "Netrakona": ("netrokona","Netrokona","নেত্রকোণা","mymensingh"),
 "Sherpur": ("sherpur","Sherpur","শেরপুর","mymensingh"),
}

feats = g["features"]
assert len(feats) == 64, len(feats)
missing = [f["properties"]["shapeName"] for f in feats if f["properties"]["shapeName"] not in T]
assert not missing, missing

# bounding box
minx = miny = 1e9
maxx = maxy = -1e9
for f in feats:
    x0, y0, x1, y1 = shape(f["geometry"]).bounds
    minx, miny, maxx, maxy = min(minx, x0), min(miny, y0), max(maxx, x1), max(maxy, y1)

lat0 = math.radians((miny + maxy) / 2)
k = math.cos(lat0)
W = 600.0
scale = W / ((maxx - minx) * k)
H = (maxy - miny) * scale

def proj(x, y):
    return ((x - minx) * k * scale, (maxy - y) * scale)

def ring_path(coords):
    pts = [proj(x, y) for x, y in coords]
    out = []
    last = None
    for px, py in pts:
        p = (round(px, 1), round(py, 1))
        if p != last:
            out.append(p)
            last = p
    if len(out) < 3:
        return ""
    return "M" + "L".join(f"{a:g},{b:g}" for a, b in out) + "Z"

def geom_path(geom):
    geom = geom.simplify(0.0012, preserve_topology=True)
    polys = list(geom.geoms) if isinstance(geom, MultiPolygon) else [geom]
    parts = []
    for p in polys:
        if p.area * scale * scale * k < 2.0:   # drop specks
            continue
        parts.append(ring_path(p.exterior.coords))
        for r in p.interiors:
            parts.append(ring_path(r.coords))
    return "".join(parts)

rows = []
for f in feats:
    n = f["properties"]["shapeName"]
    gid, en, bn, div = T[n]
    geom = shape(f["geometry"])
    # label point: representative point of the largest polygon
    big = max(geom.geoms, key=lambda p: p.area) if isinstance(geom, MultiPolygon) else geom
    c = big.representative_point()
    cx, cy = proj(c.x, c.y)
    rows.append(dict(id=gid, en=en, bn=bn, div=div, cx=round(cx, 1), cy=round(cy, 1), d=geom_path(geom)))

with open("src/data/districts.ts", "w") as out:
    out.write("// AUTO-GENERATED by scripts/build-districts.py - do not edit by hand.\n")
    out.write("// Boundaries (c) geoBoundaries (geoboundaries.org), CC BY 4.0.\n\n")
    out.write(f"export const MAP_WIDTH = {W:g};\nexport const MAP_HEIGHT = {round(H,1):g};\n\n")
    out.write("export type DivisionId = 'dhaka'|'chattogram'|'sylhet'|'barishal'|'khulna'|'rajshahi'|'rangpur'|'mymensingh';\n\n")
    out.write("export interface District { id: string; en: string; bn: string; division: DivisionId; cx: number; cy: number; d: string }\n\n")
    out.write("export const DISTRICTS: District[] = [\n")
    for r in rows:
        out.write("  " + json.dumps(dict(id=r["id"], en=r["en"], bn=r["bn"], division=r["div"], cx=r["cx"], cy=r["cy"], d=r["d"]), ensure_ascii=False) + ",\n")
    out.write("];\n")

print("ok", len(rows), "H=", round(H, 1))
