import React from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { targetsState, boxState, ratioState, screenState } from '../../states';

function SourceArea(props) {
  const [targets, setTargets] = useRecoilState(targetsState);
  const box = useRecoilValue(boxState);
  const ratio = useRecoilValue(ratioState);
  const screen = useRecoilValue(screenState);

  let posX = 0;
  let posY = 0;

  let originalX = 0;
  let originalY = 0;

  const dragStartHandler = e => {
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);

    posX = e.clientX;
    posY = e.clientY;

    originalX = e.target.offsetLeft;
    originalY = e.target.offsetTop;
  };

  const dragHandler = e => {
    e.target.style.left = `${e.target.offsetLeft + e.clientX - posX}px`;
    e.target.style.top = `${e.target.offsetTop + e.clientY - posY}px`;

    posY = e.clientY;
    posX = e.clientX;
  };

  const dragEndHandler = e => {
    if (
      box.left < e.clientX &&
      e.clientX < box.right &&
      box.top < e.clientY &&
      e.clientY < box.bottom
    ) {
      setTargets(targets => {
        const newTargets = [...targets];
        newTargets.push({
          id: parseInt(e.timeStamp),
          top:
            e.target.offsetTop +
            (e.clientY - posY - 123 - parseInt(screen.top)) / ratio,
          left:
            e.target.offsetLeft +
            (e.clientX - posX - 168 - parseInt(screen.left)) / ratio,
          details: STOCK_DATA[e.target.id],
        });
        return newTargets;
      });
    }

    e.target.style.left = `${originalX}px`;
    e.target.style.top = `${originalY}px`;
  };

  return (
    <Container>
      <Label draggable={false}>STOCKS 📈</Label>
      <StockContainer>
        {STOCK_DATA.map((data, index) => (
          <Stock
            key={index}
            id={index}
            onDragStart={dragStartHandler}
            onDrag={dragHandler}
            onDragEnd={dragEndHandler}
            top={index * 70}
            draggable
          >
            {data.name}
          </Stock>
        ))}
      </StockContainer>
    </Container>
  );
}

const STOCK_DATA = [
  {
    name: '대한항공 🛫',
    price: 31800,
    volume: 4236455,
    marketCap: 11.607,
  },
  {
    name: '셀트리온 💊',
    price: 281500,
    volume: 811596,
    marketCap: 38.8235,
  },
  {
    name: '현대차 🚗',
    price: 241000,
    volume: 1272487,
    marketCap: 51.494,
  },
  {
    name: '카카오 🍋',
    price: 159000,
    volume: 4585854,
    marketCap: 70.5848,
  },
  {
    name: '하이브 🕺',
    price: 324500,
    volume: 543674,
    marketCap: 12.2828,
  },
  {
    name: '네이버 🍀',
    price: 391000,
    volume: 698598,
    marketCap: 64.227,
  },
  {
    name: '삼성전자 🌊',
    price: 80000,
    volume: 11284877,
    marketCap: 477.5826,
  },
];

const Container = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 85vh;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  background-color: white;
  z-index: 10;
`;

const Label = styled.div`
  margin: 20px auto;
  color: darkgray;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
`;

const StockContainer = styled.div`
  ${({ theme }) => theme.flexColumnSet()};
`;

const Stock = styled.div`
  position: absolute;
  top: ${props => `${props.top + 150}px`};
  width: 260px;
  padding: 20px 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  text-align: center;
  z-index: 10;
  cursor: pointer;

  &:hover {
    background-color: #e4ede6;
    z-index: 50;
  }
`;

export default SourceArea;
