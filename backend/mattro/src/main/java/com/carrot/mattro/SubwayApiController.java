package com.spark.spark;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subway/recommendation")
@RequiredArgsConstructor
public class SubwayApiController {

    private MongoDBService mds;

    @GetMapping("/find/{subway_name}")
    public void getPlaceBySubwayName(@PathVariable String name){

    }
}
