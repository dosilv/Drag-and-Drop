import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { targetState } from '../../states';

function TargetArea(props) {
  const [target, setTarget] = useRecoilState(targetState);

  return (
    <Container>
      <Label draggable={false}>CART 🛒</Label>
      <WordContainer>
        {target.map(data => (
          <Word top={data.top} left={data.left}>
            {data.text}
          </Word>
        ))}
      </WordContainer>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 420px;
  width: 1000px;
  height: 800px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
`;

const Label = styled.div`
  margin: 20px auto;
  color: darkgray;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
`;

const WordContainer = styled.div`
  width: 95%;
  height: 80%;
  margin: auto;
  border-radius: 10px;
  background-color: #c1d0e3;
`;

const Word = styled.div`
  position: fixed;
  top: ${props => `${props.top}px`};
  left: ${props => `${props.left}px`};
  width: fit-content;
  height: 60px;
  margin: 5px;
  padding: 20px 50px;
  border-radius: 10px;
  background-color: white;
  text-align: center;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
`;

export default TargetArea;
