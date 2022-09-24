package com.carrot.mattro;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("")
public class UserPreferApiController {
    private UserPreferService userPreferService;
    @PostMapping("/user/prefer")
    public void userPrefer(@RequestBody List<Integer> surveyResult){
        userPreferService.userPrefer(surveyResult);
    }

}
