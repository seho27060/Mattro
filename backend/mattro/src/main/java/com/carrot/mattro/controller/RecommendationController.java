package com.carrot.mattro.controller;

import com.carrot.mattro.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subway/recommendation/find")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{subwayName}")
    public ResponseEntity<String> recommendStore(@PathVariable String subwayName) {
        String recommend = recommendationService.recommendationStore(subwayName);
        if(recommendationService.recommendationStore(subwayName) != null)
            return new ResponseEntity(recommend, HttpStatus.OK);
        else
            return new ResponseEntity("데이터가 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
