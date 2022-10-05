package com.carrot.mattro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

// 제플린, 무중단 배포, 수도권 데이터 디비에 완벽히
// 크롤링한 데이터 애들한테 6등분 했음
// 그냥 짤랐냐? 손으로? 
@EnableCaching
@SpringBootApplication
public class MattroApplication {

	public static void main(String[] args) {
		SpringApplication.run(MattroApplication.class, args);
	}

}
