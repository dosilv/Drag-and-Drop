import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { targetsState, boxState } from '../../states';

function TargetArea(props) {
  const stockContainer = useRef();
  const [targets, setTargets] = useRecoilState(targetsState);
  const [box, setBox] = useRecoilState(boxState);
  const [best, setBest] = useState({
    price: undefined,
    volume: undefined,
    marketCap: undefined,
  });

  const [copy, setCopy] = useState();

  useEffect(() => {
    let bestPriceStock = undefined;
    targets.forEach(target => {
      if (!bestPriceStock) {
        bestPriceStock = target;
        return;
      }
      if (target.details.price > bestPriceStock.details.price) {
        bestPriceStock = target;
      }
    });

    let bestVolumeStock = undefined;
    targets.forEach(target => {
      if (!bestVolumeStock) {
        bestVolumeStock = target;
        return;
      }
      if (target.details.volume > bestVolumeStock.details.volume) {
        bestVolumeStock = target;
      }
    });

    let bestCapStock = undefined;
    targets.forEach(target => {
      if (!bestCapStock) {
        bestCapStock = target;
        return;
      }
      if (target.details.marketCap > bestCapStock.details.marketCap) {
        bestCapStock = target;
      }
    });

    setBest({
      price: bestPriceStock,
      volume: bestVolumeStock,
      marketCap: bestCapStock,
    });
  }, [targets]);

  useEffect(() => {
    const box = stockContainer.current.getBoundingClientRect();
    setBox({
      top: box.top,
      left: box.left,
      bottom: box.top + box.height,
      right: box.left + box.width,
    });
  }, []);

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

  const dragEndHandler = (e, index) => {
    if (
      box.left < e.clientX &&
      e.clientX < box.right &&
      box.top < e.clientY &&
      e.clientY < box.bottom
    ) {
      setTargets(targets => {
        const newTargets = [...targets];
        const currentTarget = { ...newTargets.splice(index, 1)[0] };
        currentTarget.left = e.target.offsetLeft + e.clientX - posX;
        currentTarget.top = e.target.offsetTop + e.clientY - posY;
        newTargets.push(currentTarget);
        return newTargets;
      });
      e.target.style.left = `${e.target.offsetLeft + e.clientX - posX}px`;
      e.target.style.top = `${e.target.offsetTop + e.clientY - posY}px`;
      return;
    }
    e.target.style.top = `${originalY}px`;
    e.target.style.left = `${originalX}px`;
  };

  const clickHandler = (e, index) => {
    setCopy(index);
  };

  useEffect(() => {
    document.onkeydown = e => {
      if (e.ctrlKey && e.key === 'v') {
        setTargets(targets => {
          const copiedTarget = targets.slice(copy, copy + 1)[0];

          const modifiedTarget = copiedTarget && {
            ...copiedTarget,
            id: copiedTarget.id + 1,
            left: copiedTarget.left + 30,
            top: copiedTarget.top + 20,
          };

          const newTargets = [...targets];
          newTargets.push(modifiedTarget);
          return newTargets;
        });
        setCopy(targets.length);
      }
    };
  });

  // useEffect(() => {
  //   console.log(targets);
  // }, [targets]);

  return (
    <Container>
      <Label draggable={false}>TABLE 📊</Label>
      <StockContainer ref={stockContainer}>
        {targets.map(start => {
          return targets.slice(start).map(end => (
            <svg width="100vw" height="100vh">
              <line
                x1={start.left + 100}
                y1={start.top + 80}
                x2={end.left + 100}
                y2={end.top + 80}
                stroke="gray"
                strokeWidth="1"
              />
            </svg>
          ));
        })}
        {targets.map((data, index) => (
          <Stock
            key={data.id}
            top={data.top}
            left={data.left}
            onDragStart={dragStartHandler}
            onDrag={dragHandler}
            onDragEnd={e => dragEndHandler(e, index)}
            onClick={e => clickHandler(e, index)}
            border={copy === index}
            draggable
          >
            {data.details.name}
            <Details>
              <Close
                onClick={() =>
                  setTargets(targets => {
                    const newTargets = targets.filter(
                      target => target.id !== data.id
                    );
                    return newTargets;
                  })
                }
              >
                ✖
              </Close>
              <Info best={best.price === data}>
                stock price: {data.details.price.toLocaleString()}
              </Info>
              <Info best={best.volume === data}>
                volume: {data.details.volume.toLocaleString()}
              </Info>
              <Info best={best.marketCap === data}>
                market cap: {data.details.marketCap.toLocaleString()}
              </Info>
            </Details>
          </Stock>
        ))}
      </StockContainer>
    </Container>
  );
}

const Container = styled.div`
  flex-shrink: 0;
  width: 1000px;
  height: 80vh;
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

const StockContainer = styled.div`
  width: 95%;
  height: 85%;
  margin: auto;
  border-radius: 10px;
  background-color: #c1d0e3;

  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Stock = styled.div`
  position: absolute;
  top: ${props => `${props.top}px`};
  left: ${props => `${props.left}px`};
  width: 200px;
  height: 160px;
  padding-top: 22px;
  border: ${props => props.border && '1px solid gray'};
  border-radius: 10px;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  cursor: pointer;
`;

const Details = styled.div`
  position: relative;
  width: 100%;
  background-color: #e8e5dc;
  margin-top: 20px;
`;

const Close = styled.button`
  position: absolute;
  top: -50px;
  right: 10px;
  cursor: pointer;
`;

const Info = styled.p`
  padding-bottom: 6px;
  background-color: ${props => props.best && '#cfc8bc'};
  line-height: 1.8;
`;

export default TargetArea;
