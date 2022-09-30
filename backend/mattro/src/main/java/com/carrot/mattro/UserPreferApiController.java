package com.carrot.mattro;


import com.carrot.mattro.DTO.CrawlingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class UserPreferApiController {
    private final UserPreferService userPreferService;
    @GetMapping("/individual/recommendation/{choices}")
    public ResponseEntity userPrefer(@PathVariable("choices") String choices){
        List<Integer> result = userPreferService.userPrefer(choices);

        if(result.isEmpty()){
            return new ResponseEntity("데이터가 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }else{

            return new ResponseEntity(result,HttpStatus.OK);
        }
    }

    @GetMapping("/individual/recommendation/list/{storeIndexStr}")
    public ResponseEntity getStoreByStoreIndexList(@PathVariable(name = "storeIndexStr") String storeIndexStr){
        List<Output> result = userPreferService.getStoreByStoreIndexList(storeIndexStr);

        if(result.isEmpty()){
            return new ResponseEntity("데이터가 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }else{

            return new ResponseEntity(result,HttpStatus.OK);
        }
    }

}
