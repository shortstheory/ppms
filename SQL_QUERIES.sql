-- Login:
'SELECT ID, NAME, MOBILE, ADMIN_ID FROM DOCTOR WHERE NAME = ' + name ' AND PASSWORD = ' + password + ';'

-- Vaccine search:
'SELECT NAME, PRICE, STOCK FROM VACCINE WHERE NAME LIKE "%' + name + '%"';

-- Vaccine add:
'INSERT INTO VACCINE (NAME, PRICE,STOCK) VALUES(' + name +', ' + price + ', ' + stock + ');'

-- Patient search:
'SELECT * FROM PATIENT WHERE NAME LIKE "%' + name + '%";'
'SELECT * FROM PATIENT WHERE MOBILE=' + mob + ';'
'SELECT * FROM PATIENT P, P_VISITS_D V WHERE P.ID = V.PID AND V.VISIT_DATE=' + start_date + ';'

-- New Patient:
'INSERT INTO PATIENT (NAME, DOB, MOBILE, ADDRESS) VALUES(' + name + ', ' + dob + ', ' + mobile + ', ' + address + ');'

-- Edit Patient:
'UPDATE TABLE PATIENT SET NAME = '+ name + ', DOB = ' + dob + ', MOBILE = ' + mob + ', ADDRESS = ' + address + ' WHERE ID = '+ id +';'

-- Delete Patient
'DELETE FROM PATIENT WHERE ID = '+ id +';'

-- Add visit record:
'INSERT INTO P_VISITS_D (PID, VID, VISIT_DATE, DIAGNOSIS, TREATMENT) VALUES ('+pid+', '+did+', DATE(SYSDATE()), '+diagnosis+', '+treatment+');'
-- if vaccine was taken, also execute:
'INSERT INTO P_TAKES_V (PID, VID, VISIT_ID) VALUES ('+pid+', (SELECT VID FROM VACCINE WHERE NAME='+vname+'), (SELECT MAX(ID) FROM P_VISITS_D));'
