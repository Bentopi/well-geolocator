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
    else console.log('Data import successful')
  });
}

const connect = ()=> {
  client.connect((err)=> {
    if(!err){
      console.log('Database connection successful')
      if(process.env.SEED){
        seed();
      }
    }
    else {
      console.log(err);
    }
  });
};

module.exports = { connect };
