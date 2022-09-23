package com.carrot.mattro;

import com.carrot.mattro.DTO.OutputResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subway/recommendation")
@RequiredArgsConstructor
public class SubwayApiController {

    private final MongoDBService mds;

    @GetMapping("/find/{subway_name}")
    public ResponseEntity getPlaceBySubwayName(@PathVariable String name){
        OutputResponse response = mds.findPlaceBySubwayName(name);
        if(response != null)
            return new ResponseEntity(response, HttpStatus.OK);
        else
            return new ResponseEntity("찾고자 하는 값이 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
