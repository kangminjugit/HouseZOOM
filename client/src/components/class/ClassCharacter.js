import React, { useEffect, useState } from 'react';

const null_arr = [''];

const ClassCharacter = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const [myitems, setMyitems] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMyitems(items);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!myitems) return;

  return (
    <div>
      <img
        style={{
          position: 'absolute',
          zIndex: '1',
          height: '12rem',
        }}
        alt="body"
        src="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1653650799828_IMG_3787.PNG"
      />
      {myitems.map((item, index) => (
        <img
          style={{
            position: 'absolute',
            zIndex: '2',
            height: '12rem',
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
