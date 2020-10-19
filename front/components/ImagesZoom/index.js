import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Overlay, Global, Header, CloseBtn, SlickWrapper, ImageWrapper, Indicator  } from './style';



const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose} />
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0} // 첫 번째를 어떤 슬라이드로 할 지
            beforeChange={(slide) => setCurrentSlide(slide)} // 번호
            infinite
            arrows={false} // 사이드 화살표
            slidesToShow={1} // 한 번에 하나 씩만 보이고 하나 씩만 넘길 수 있게
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImageWrapper key={v.src} >
                <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
              </ImageWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1}
              {' '}
              /
              {' '}
              {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};


ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};


export default ImagesZoom;