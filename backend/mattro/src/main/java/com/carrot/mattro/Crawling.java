package com.carrot.mattro;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "crolling")
public class Crawling {
    @Id
    private String id;

//    private String 역명;
    private String storeIdx;
    private String searchKeyword;
    private String name;
    private String foodCategory;
    private String rating;
    private String tell;
    private List<String> reviews;
    private String reviewCnt;
    private String blogCnt;
    private String mainImageURL;
    private String menuImageURL;
    private List<String> menuList;
    private org.bson.Document keywordReviewList;
    private String storeURL;
    private String longitude;
    private String latitude;


    @Override
    public String toString() {
        return "Result{" +
                "id='" + id + '\'' +
                ", storeIdx='" + storeIdx + '\'' +
                ", searchKeyword='" + searchKeyword + '\'' +
                ", name='" + name + '\'' +
                ", foodCategory='" + foodCategory + '\'' +
                ", rating='" + rating + '\'' +
                ", tell='" + tell + '\'' +
                ", reviews=" + reviews +
                ", reviewCnt='" + reviewCnt + '\'' +
                ", blogCnt='" + blogCnt + '\'' +
                ", mainImageURL='" + mainImageURL + '\'' +
                ", menuImageURL='" + menuImageURL + '\'' +
                ", menuList=" + menuList +
                ", keywordReviewList=" + keywordReviewList +
                ", storeURL='" + storeURL + '\'' +
                ", longitude='" + longitude + '\'' +
                ", latitude='" + latitude + '\'' +
                '}';
    }
}
