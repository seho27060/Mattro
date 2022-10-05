package com.carrot.mattro.domain.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
@Document(collection = "subwayToStore")
@Data
public class Output {
    @Id
    private String id;
    private String 역명;
    private String 위도;
    private String 경도;
    private String tell;
    private String storeIdx;
    private String storURL;
    private String searchKeyword;
    private List<String> reviews;
    private String reviewCnt;
    private String rating;
    private String name;
    private List<String> menuList;
    private String menuImageURL;
    private String mainImageURL;
    private String longitude;
    private String latitude;
    private org.bson.Document keywordReviewList;
    private String foodCategory;
    private String blogCnt;
}
