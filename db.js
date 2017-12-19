const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

const seed = ()=> {
  const qry = `
    DROP TABLE WELLS;
    CREATE TABLE WELLS (
      ID SERIAL PRIMARY KEY,
      UWI INT,
      LONG DOUBLE PRECISION,
      LAT DOUBLE PRECISION,
      LEASE TEXT,
      OPERATOR TEXT,
      FAKE_NUMBER INT
    );
    COPY WELLS("uwi", "long", "lat", "lease", "operator", "fake_number")
    FROM '/Users/brian/Dropbox/Documents/Programming/Node/well-geolocator/seed_data.csv' WITH CSV HEADER;
  `;
  client.query(qry, (err, result)=> {
    if(err){
      console.log(err);
    }
  });
}

const connect = ()=> {
  client.connect((err)=> {
    if(!err){
      console.log('Database connection successful')
      if(process.env.SEED){
        seed();
        console.log('Data import successful')
      }
    }
    else {
      console.log(err);
    }
  });
};

const getWell = (id, cb)=> {
  client.query('SELECT * FROM WELLS WHERE ID = $1', [ id ], (err, result)=> {
    if(err){
      return cb(err);
    }
    if(result.rows.length === 0) {
      return cb(new Error('No record found for that id'));
    }
    cb(null, result.rows[0]);
  });
};

const getWells = (cb)=> {
  client.query('SELECT * FROM WELLS', (err, result)=> {
    if(err){
      return cb(err);
    }
    cb(null, result.rows);
  });
}


module.exports = { connect, getWells, getWell };
