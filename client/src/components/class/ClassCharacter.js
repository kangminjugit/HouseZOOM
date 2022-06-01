import React, { useEffect, useState } from 'react';

const null_arr = [''];

const ClassCharacter = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const [myitems, setMyitems] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMyitems(items);
      console.log(myitems);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!myitems) return setMyitems(['']);

  return (
    <div>
      <img
        style={{
          position: 'absolute',
          zIndex: '1',
          top: '10px',
          left: '0px',
          height: '170px',
        }}
        alt="body"
        src="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1653650799828_IMG_3787.PNG"
      />
      {/* <img
        style={{
          position: 'absolute',
          zIndex: '2',
          top: '10px',
          left: '0px',
          height: '170px',
        }}
        alt="hair"
        src="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651027698618_IMG_3755.PNG"
      /> */}
      {myitems.map((item, index) => (
        <img
          style={{
            position: 'absolute',
            zIndex: '2',
            top: '10px',
            left: '0px',
            height: '170px',
          }}
          key={index}
          alt={item.item_type}
          src={item.item_image}
        />
      ))}
    </div>
  );
};

export default ClassCharacter;
