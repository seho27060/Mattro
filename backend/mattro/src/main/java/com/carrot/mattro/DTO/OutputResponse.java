package com.carrot.mattro.DTO;

import com.carrot.mattro.domain.entity.Output;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutputResponse {

    public OutputResponse(Output output){
        this.id = output.getId();
        this.storeIdx = output.getStoreIdx();
        this.foodCategory = output.getFoodCategory();
        this.menuImageURL = output.getMenuImageURL();
        this.mainImageURL = output.getMainImageURL();
        this.storURL = output.getStorURL();
        this.tell = output.getTell();
        this.storeName = output.getName();
    }
    private String id;
    private String storeIdx;
    private String storeName;
    private String foodCategory;
    private String menuImageURL;
    private String mainImageURL;
    private String storURL;
    private String tell;

}
