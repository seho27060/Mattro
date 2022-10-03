package com.carrot.mattro.controller;

import com.carrot.mattro.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/subway/recommendation/find")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final String EMPTY_RESULT = "empty_result";
    private final String EMPTY_SUBWAY = "empty_subway";

    @GetMapping("/{subwayName}")
    public ResponseEntity<String> recommendStore(@PathVariable String subwayName) {
        String recommend = recommendationService.recommendationStore(subwayName);

        if(recommend.equals(EMPTY_SUBWAY)){
            return new ResponseEntity("역이 없습니다.", HttpStatus.BAD_REQUEST);
        }

        if(recommend.equals(EMPTY_RESULT)){
            return new ResponseEntity("데이터가 없습니다.", HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity(recommend, HttpStatus.OK);
    }
}
