import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { targetsState, boxState, ratioState, screenState } from '../../states';

function TargetArea(props) {
  const wholeContainer = useRef();
  const stockContainer = useRef();

  const [targets, setTargets] = useRecoilState(targetsState);
  const [box, setBox] = useRecoilState(boxState);
  const [screen, setScreen] = useRecoilState(screenState);

  const [best, setBest] = useState({
    price: undefined,
    volume: undefined,
    marketCap: undefined,
  });

  const [copy, setCopy] = useState();

  const [showRatio, setShowRatio] = useState(false);

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
    const box = wholeContainer.current.getBoundingClientRect();
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
    e.stopPropagation();

    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);

    posX = e.clientX;
    posY = e.clientY;

    originalX = e.target.offsetLeft;
    originalY = e.target.offsetTop;
  };

  const dragHandler = e => {
    e.stopPropagation();

    e.target.style.left = `${
      e.target.offsetLeft + (e.clientX - posX) / ratio
    }px`;
    e.target.style.top = `${e.target.offsetTop + (e.clientY - posY) / ratio}px`;

    posX = e.clientX;
    posY = e.clientY;
  };

  const dragEndHandler = (e, index) => {
    e.stopPropagation();

    if (
      box.left < e.clientX &&
      e.clientX < box.right &&
      box.top < e.clientY &&
      e.clientY < box.bottom
    ) {
      setTargets(targets => {
        const newTargets = [...targets];
        const currentTarget = { ...newTargets.splice(index, 1)[0] };
        currentTarget.left = e.target.offsetLeft + (e.clientX - posX) / ratio;
        currentTarget.top = e.target.offsetTop + (e.clientY - posY) / ratio;
        newTargets.push(currentTarget);
        return newTargets;
      });
      e.target.style.left = `${
        e.target.offsetLeft + (e.clientX - posX) / ratio
      }px`;
      e.target.style.top = `${
        e.target.offsetTop + (e.clientY - posY) / ratio
      }px`;
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
      if (e.ctrlKey && e.key === 'z') {
        setTargets(targets => {
          return targets.slice(0, -1);
        });
      }
    };
  });

  const [ratio, setRatio] = useRecoilState(ratioState);

  const wheelHandler = e => {
    setRatio(ratio => (ratio >= 0.2 ? ratio + 0.001 * e.deltaY : 0.2));
  };

  const moveScreenStart = e => {
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);

    posX = e.clientX;
    posY = e.clientY;
  };

  const moveScreen = e => {
    if (e.target !== stockContainer.current) return;

    const limitX = e.target.offsetLeft + (e.clientX - posX) / ratio <= 0;
    const limitY = e.target.offsetTop + (e.clientY - posY) / ratio <= 0;

    e.target.style.left = limitX
      ? `${e.target.offsetLeft + (e.clientX - posX) / ratio}px`
      : '0px';
    e.target.style.top = limitY
      ? `${e.target.offsetTop + (e.clientY - posY) / ratio}px`
      : '0px';

    posX = limitX ? e.clientX : 0;
    posY = limitY ? e.clientY : 0;
  };

  const moveScreenEnd = e => {
    const limitX = e.target.offsetLeft + (e.clientX - posX) / ratio <= 0;
    const limitY = e.target.offsetTop + (e.clientY - posY) / ratio <= 0;

    e.target.style.left = limitX
      ? `${e.target.offsetLeft + (e.clientX - posX) / ratio}px`
      : '0px';
    e.target.style.top = limitY
      ? `${e.target.offsetTop + (e.clientY - posY) / ratio}px`
      : '0px';

    setScreen({ top: e.target.style.top, left: e.target.style.left });
  };

  // useEffect(() => {
  //   console.log(targets);
  // }, [targets]);

  return (
    <Container>
      <Label draggable={false}>TABLE 📊</Label>
      <WholeContainer ref={wholeContainer}>
        <StockContainer
          ref={stockContainer}
          onWheel={wheelHandler}
          ratio={ratio}
          onDragStart={moveScreenStart}
          onDragCapture={moveScreen}
          onDragEnd={moveScreenEnd}
          draggable
        >
          {targets.map(start => {
            return targets.slice(start).map(end => (
              <svg>
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
        <Icon
          onMouseOver={() => setShowRatio(true)}
          onMouseLeave={() => {
            setShowRatio(false);
          }}
        >
          <i className="fas fa-search" />
          {showRatio && (
            <Ratio>
              <li
                onClick={() => {
                  setRatio(ratio => ratio - 0.25);
                }}
              >
                −
              </li>
              <li
                onClick={() => {
                  stockContainer.current.style.top = '0';
                  stockContainer.current.style.left = '0';
                  setScreen({ top: 0, left: 0 });
                  setRatio(1);
                }}
              >
                1.0
              </li>
              <li
                onClick={() => {
                  setRatio(ratio => ratio + 0.25);
                }}
              >
                +
              </li>
            </Ratio>
          )}
        </Icon>
      </WholeContainer>
    </Container>
  );
}

const Container = styled.div`
  flex-shrink: 0;
  width: 1100px;
  height: 85vh;
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

const WholeContainer = styled.div`
  position: relative;
  width: 95%;
  height: 87%;
  margin: auto;
  border-radius: 10px;
  background-color: #c1d0e3;
  overflow: hidden;
`;

const StockContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: ${props => 200 / props.ratio}%;
  height: ${props => 200 / props.ratio}%;
  transform: scale(${props => props.ratio});
  transform-origin: left top;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
  background-color: #d3dae3;
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
  background-color: ${props => props.best && '#556b85'};
  color: ${props => props.best && 'white'};
  line-height: 1.8;
`;

const Icon = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  background-color: white;
  cursor: pointer;

  i {
    font-size: 24px;
    color: black;
  }
`;

const Ratio = styled.ul`
  color: gray;
  text-align: center;

  li {
    padding-top: 15px;
  }
`;

export default TargetArea;
