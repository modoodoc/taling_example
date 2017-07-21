import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'koreanTimePipe',
})
export class KoreanTimePipe implements PipeTransform {

  transform(value, args) {
    return moment(value).format("hh:mma");
  }
}
