## TODO
1. Separate 'County Subdivision' and address queries into two separate requests to increase reliability of results from the geocoder.
-- return and autofill address info --> then query for town
--- if town, change pstat to Town of Madison
--- if not town, don't change
--- if town is null, set to MAD-UND
