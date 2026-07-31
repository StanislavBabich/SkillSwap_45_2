import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/user.enums';
import { CitiesService } from './cities.service';
import { UpdateCityDto } from './dto/update-city.dto';
import {
  ApiCitiesController,
  ApiDeleteCity,
  ApiUpdateCity,
} from './cities.swagger';

@ApiCitiesController()
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Patch(':id')
  @ApiUpdateCity()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ApiDeleteCity()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.citiesService.remove(id);
  }
}
