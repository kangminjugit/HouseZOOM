import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Character = () => {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(null);

  //토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(localStorage.getItem('student_user'));
      const url =
        'http://3.35.141.211:3000/api/avatar/cur-item?studentId=%student1';
      accessClient
        .get(url)
        .then(function (response) {
          console.log(response);
          setCharacter();
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);
    };
    fetchData();
  });

  if (loading) {
    return <div>로딩중</div>;
  }

  return (
    <div>
      <img className="img" alt="character" src="/puang_img/puang_gibon.png" />
    </div>
  );
};

export default Character;
