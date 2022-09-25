package com.carrot.mattro;

import com.carrot.mattro.DTO.CrawlingResponse;

import java.util.List;


public interface UserPreferService {
    List<CrawlingResponse> userPrefer(String choices);
}
