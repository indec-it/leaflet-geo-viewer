# Comandos usados para la preparación de datos  
## A partir del mosaico provincial de imagenes satelitales Landsat8 Fusion (15m)

gdal2tiles.py -t "BS AS" -c INDEC -z 8 -e -d -a 0 -p raster -v  -s EPSG:22185 -r cubic  /BsAsGK5.tif /tiles_bs_as

## Paso de png generados a jpg

find tiles_bsas -iname '*.png' | while read i; do mogrify -format jpg "$i" && rm "$i"; echo "Converted $i to ${i%.*}.jpg"; done 


## Paso de PostgreSQL a SpatiaLite con Ogr2ogr

ogr2ogr -f SQLite -dsco SPATIALITE=yes -nln datos -lco SPATIAL_INDEX=YES c:\cna2018.sqlite PG:"host=localhost user=usuario password=usuario dbname=openstreetmap" spatialite_nacional
