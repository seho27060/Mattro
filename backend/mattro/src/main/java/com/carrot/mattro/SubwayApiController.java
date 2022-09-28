package com.carrot.mattro;

import com.carrot.mattro.DTO.OutputResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

//@CrossOrigin("*")
@RestController
@RequestMapping("/subway/recommendation")
@RequiredArgsConstructor
public class SubwayApiController {

    private final MongoDBService mds;

    @GetMapping("/find/{subway_name}")
    public ResponseEntity getPlaceBySubwayName(@PathVariable(name = "subway_name") String name){
        Optional<Output> response = mds.findPlaceBySubwayName(name);
        if(response != null)
            return new ResponseEntity(response, HttpStatus.OK);
        else
            return new ResponseEntity("데이터가 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/{store_index}")
    public ResponseEntity getPlaceByStoreIndex(@PathVariable(name = "store_index") String storeIndex){
        Optional<Output> response = mds.findPlaceByStoreIndex(storeIndex);
        if(response != null) {
            return new ResponseEntity(response, HttpStatus.OK);
        }else {
            return new ResponseEntity("데이터가 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
