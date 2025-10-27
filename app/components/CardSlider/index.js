import React from 'react';
import { Link } from 'react-router-dom';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/navigation/navigation.min.css';

export function CardSlider(image) {
  SwiperCore.use([Navigation, Pagination]);

  return (
    <div className="card slide" style={{ width: '1100px', height: '500' }}>
      <Swiper
        className="banner"
        spaceBetween={50}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
      >
        {image.image.results.map(v => (
          <SwiperSlide>
            <>
              <Link
                to={`/market-tracker/${v.contractAddress}/${v.name}/${
                  v.tokenId
                }`}
              >
                <img
                  src={v.src}
                  alt="nftImage"
                  style={{ width: '100%', height: '250px' }}
                />
                <div className="card information">
                  <div
                    className="card name"
                    style={{
                      float: 'left',
                      width: '50%',
                      textAlign: 'left',
                      color: 'white',
                    }}
                  >
                    {v.name}
                  </div>
                  <div
                    className="card value"
                    style={{
                      float: 'right',
                      width: '50%',
                      textAlign: 'right',
                      color: 'white',
                    }}
                  >
                    {v.value}
                  </div>

                  <div
                    className="card name"
                    style={{
                      float: 'left',
                      width: '50%',
                      textAlign: 'left',
                      color: 'white',
                    }}
                  >
                    {v.tokenId}
                  </div>
                  <div
                    className="card value"
                    style={{
                      float: 'right',
                      width: '50%',
                      textAlign: 'right',
                      color: 'white',
                    }}
                  >
                    {v.won}
                  </div>
                </div>
              </Link>
            </>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
export default CardSlider;
