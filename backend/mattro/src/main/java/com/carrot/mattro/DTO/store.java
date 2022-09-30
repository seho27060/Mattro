package com.carrot.mattro.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class store {
    private String storeIdx;
    private double z;

    public store(String storeIdx, double z){
        this.storeIdx = storeIdx;
        this.z = z;
    }
}
